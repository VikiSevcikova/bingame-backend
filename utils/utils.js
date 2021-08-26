function validateEmail(email){
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    // let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let valid = email.match(pattern);
    console.log(email)
    return valid;
}

function validatePassword(password){
    // let pattern = /(?=(.*[\d]){6,})(?=.*?[a-z]){1,}(?=(.*[A-Z]){1,})(?=(.*[@#$%^&*])){1,}/;
    let pattern = /(?=(.*[\d]){3,})(?=.*?[a-z]){1,}(?=(.*[A-Z]){1,})/;
    let valid = password.match(pattern);
    return valid;
}

module.exports = {validateEmail, validatePassword}