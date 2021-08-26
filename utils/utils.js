exports.validateEmail = (email) => {
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let valid = email.match(pattern);
    console.log(email)
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
