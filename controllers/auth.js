const jwt = require('jsonwebtoken');
const basicAuth = require("express-basic-auth");
const ErrorResponse = require("../utils/errorResponse");
const db = require('../utils/SimpleDB');

exports.register = async (req, res, next) => {
    console.log('register');
    const {username, email, password} = req.body;
    
    try{
        db.Create(username, email, password);
        sendToken(user, 201, res);
    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}

exports.login = async (req, res, next) => {
    console.log("login");
    const {email, password} = req.body;
    console.log(req.body)
    if(!email || !password){
        res.status(400).json({success: false, error: "Please provide email and password."});
    }

    try{
        //check if user password matches with the password from req.body
        const userMatches = basicAuth.safeCompare(email, 'admin@gmail.com')
        const passwordMatches = basicAuth.safeCompare(password, 'secret')
        if(!userMatches || !passwordMatches){
            return res.status(404).json({success:false, error: "Invalid credentials."});
        }

        sendToken(email, 200, res);

    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}

const sendToken = (email, statusCode, res) => {
    const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
    res.status(statusCode).json({success: true, token});
}