const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const validateEmail = require("../utils/utils").validateEmail;
const validatePassword = require("../utils/utils").validatePassword;
const { getRandomNumber } = require("../utils/utils");

exports.register = async (req, res, next) => {
  console.log("register");
  const { username, email, password } = req.body;

  // validation of the email and password
  if (!validateEmail(email)) {
    res.status(400).json({ success: false, error: "Invalid email" });
    return;
  }

  if (!validatePassword(password)) {
    res
      .status(400)
      .json({
        success: false,
        error:
          "Password must have at least 3 digits. At least one lowercase. At least one uppercase.",
      });
    return;
  }

  try {
    //connect to the client
    MongoClient.connect(
      process.env.MONGO_URI_LOCALHOST,
      async function (err, db) {
        if (err) throw err;
        //connect to bingame db
        const dbo = db.db("bingame");

        //encrypt the password before sage
        const salt = await bcrypt.genSalt(getRandomNumber(1000));
        const cryptedPassword = await bcrypt.hash(password, salt);

        const newUser = {
          username: username,
          email: email,
          password: cryptedPassword,
        };
        //get users collection from DB and find user based on email
        dbo.collection("users").findOne({ email }, function (err, result) {
          //if there error or no result it means that user was not found so new user can be created
          if (err || !result) {
            //add new user do the collection
            dbo.collection("users").insertOne(newUser, function (err, r) {
              if (err) throw err;
              console.log("1 user inserted");
              //if there is no error then send token and also the data about the user
              sendToken(
                {
                  _id: r.insertedId,
                  username: username,
                  email: email,
                  password: cryptedPassword,
                },
                201,
                res
              );
              db.close();
            });
          } else {
            res
              .status(400)
              .json({ success: false, error: "User already exists." });
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //if the email and password is null return error
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Please provide email and password." });
    return;
  }

  try {
    //check if user password matches with the password from req.body
    MongoClient.connect(process.env.MONGO_URI_LOCALHOST, function (err, db) {
      if (err) throw err;
      const dbo = db.db("bingame");

      //check in the collection if the user is created
      dbo.collection("users").findOne({ email }, async function (err, result) {
        if (err) throw err;
        //if there is no result, result is null, return error
        if (!result) {
          res
            .status(404)
            .json({ success: false, error: "Invalid credentials." });
          return;
        }

        //compare if data in request body => from login page are the same as users based on email in db
        //   const emailMatches = basicAuth.safeCompare(email, result.email); //we can skip this because we already looked for user with the given email
        const passwordMatches = await bcrypt.compare(password, result.password);
        if (!emailMatches || !passwordMatches) {
          res
            .status(404)
            .json({ success: false, error: "Invalid credentials." });
          return;
        }
        //send token and the user's data
        sendToken(result, 200, res);
        db.close();
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const sendToken = (result, statusCode, res) => {
  let token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  let user = {
    username: result.username,
    email: result.email,
    password: result.password,
  };
  res.status(statusCode).json({ success: true, token, user });
};
