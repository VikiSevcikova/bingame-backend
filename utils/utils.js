const crypto = require("crypto");

exports.validateEmail = (email) => {
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let valid = email.match(pattern);
    return valid;
}

exports.validatePassword = (password) => {
    let pattern = /(?=(.*[\d]){3,})(?=.*?[a-z]){1,}(?=(.*[A-Z]){1,})/;
    let valid = password.match(pattern);
    return valid;
}

exports.getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
}

exports.getResetPasswordToken = () => {
    let resetToken = crypto.randomBytes(20).toString("hex");
    //create hash object with sha256 algorithm, updates it with data in resetToken and return in hex form
    return crypto.createHash("sha256").update(resetToken).digest("hex");
}