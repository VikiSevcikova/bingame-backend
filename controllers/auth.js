const basicAuth = require("express-basic-auth");

exports.register = async (req, res, next) => {
    console.log('register');
}

exports.login = async (req, res, next) => {
    console.log("login");
    // const {email, password} = req.body;
    // console.log(email)
}

