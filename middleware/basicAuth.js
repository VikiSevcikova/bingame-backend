const basicAuth = require("express-basic-auth");

const basicAuthorization = basicAuth({
  authorizer: (username, password, cb) => {
    // there is delay
    const userMatches = basicAuth.safeCompare("admin", username);
    const passwordMatches = basicAuth.safeCompare("supersecret", password);
    if (userMatches && passwordMatches) return cb(null, true);
    else return cb(null, false);
  },
  authorizeAsync: true,
});

module.exports = basicAuthorization;
