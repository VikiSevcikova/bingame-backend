const basicAuth = require("express-basic-auth");
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const basicAuthorization = basicAuth({
  authorizer: (email, password, cb) => {
    MongoClient.connect(process.env.MONGO_URI_LOCALHOST, function(err, db) {
      if (err) throw err;
      let dbo = db.db("bingame");
      
      dbo.collection("users").findOne({email: email}, async function(err, result) {
        if (err) throw err;
       
        db.close();
       
        // there is delay
        const userMatches = basicAuth.safeCompare(email, result.email);
        const passwordMatches = basicAuth.safeCompare(password, result.password);
        if (userMatches && passwordMatches) return cb(null, true);
        else return cb(null, false);
      
      });
    });
  },
  authorizeAsync: true,
});

module.exports = basicAuthorization;
