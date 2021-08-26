const basicAuth = require("express-basic-auth");
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const basicAuthorization = basicAuth({
  authorizer: (email, password, cb) => {
    MongoClient.connect(process.env.MONGO_URI_LOCALHOST, function(err, db) {
      if (err) throw err;
      let dbo = db.db("bingame");
      
      //check if the user with given email exists in db, if yes compare the email and also 
      dbo.collection("users").findOne({email: email}, async function(err, result) {
        if (err) throw err;
       
        db.close();
        // there is delay, so safeCompare is safer than ===
        // const emailMatches = basicAuth.safeCompare(email, result.email);  //we can skip this because we already looked for user with the given email
        const passwordMatches = basicAuth.safeCompare(password, result.password);
        if (emailMatches && passwordMatches) return cb(null, true);
        else return cb(null, false);
      
      });
    });
  },
  authorizeAsync: true,
});

module.exports = basicAuthorization;
