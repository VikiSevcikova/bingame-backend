const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const basicAuth = require("express-basic-auth");
const MongoClient = require('mongodb').MongoClient;
const validateEmail = require('../utils/utils').validateEmail;
const validatePassword = require('../utils/utils').validatePassword;

exports.register = async (req, res, next) => {
    console.log('register');
    const {username, email, password} = req.body;

    if(!validateEmail(email)){
        res.status(400).json({success: false, error: "Invalid email"});
        return
    }

    if(!validatePassword(password)){
        res.status(400).json({success: false, error: "Password must have at least 3 digits. At least one lowercase. At least one uppercase."});
        return
    }
    
    try{
        MongoClient.connect(process.env.MONGO_URI_LOCALHOST, async function(err, db) {
            if (err) throw err;
            let dbo = db.db("bingame");

            const salt = await bcrypt.genSalt(10);
            const cryptedPassword = await bcrypt.hash(password, salt);

            let newUser = { username: username, email: email, password: cryptedPassword };
            dbo.collection("users").findOne({ email }, function(err, result) {
                if (err || !result) {
                    dbo.collection("users").insertOne(newUser, function(err, r) {
                        if (err) throw err;
                        console.log("1 user inserted");
                        sendToken({_id : r.insertedId, username: username, email: email, password: cryptedPassword}, 201, res);
                        db.close();
                      });
                }else{
                    res.status(400).json({success: false, error: "User already exists."});
                }
              });
          });

    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}

exports.login = async (req, res, next) => {
    const {email, password, rememberMe} = req.body;
    if(!email || !password){
        res.status(400).json({success: false, error: "Please provide email and password."});
    }

    try{
        //check if user password matches with the password from req.body
        MongoClient.connect(process.env.MONGO_URI_LOCALHOST, function(err, db) {
            if (err) throw err;
            let dbo = db.db("bingame");
            
            dbo.collection("users").findOne({email: email}, async function(err, result) {
              if (err) throw err;
              if(!result){
                return res.status(404).json({success:false, error: "Invalid credentials."});
              }
              console.log(result)
              const userMatches = basicAuth.safeCompare(email, result.email);
              const passwordMatches = await bcrypt.compare(password, result.password);
              if(!userMatches || !passwordMatches){
                  return res.status(404).json({success:false, error: "Invalid credentials."});
              }
              //save that user is logged in
              sendToken(result, 200, res);
              db.close();

            });

          });
        
    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}

const sendToken = (result, statusCode, res) => {
    const token = jwt.sign({id: result._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
    const user = {username: result.username, email: result.email, password: result.password};
    res.status(statusCode).json({success: true, token, user});
}