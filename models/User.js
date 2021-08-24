const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username."]
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true,
        match: [ /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email."]
    },
    password: {
        type: String,
        required: [true, "Please add a password."],
        minlength: [6, "Password is shorter than minimum allowed length (6)."],
        //false, because we do not want to return password everytime we query the user
        //so we have to ask to send also the password if we need it
        select: false 
    }
});

// //run before save
// UserSchema.pre("save", async function(next){
//     //to not hash again the password
//     if(!this.isModified("password")){
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     //it will save the user with changed password
//     next();
// })

// //with mongoose we are able to create methods on created users
// //this method returns comparison on the user which was returned (user.matchPassword(password))
// UserSchema.methods.matchPasswords = async function(password){
//     return await bcrypt.compare(password, this.password);
// }

// UserSchema.methods.getSignedToken = function() {
//     //JWT_SECRET created with require('crypto').randomBytes(35).toString("hex")
//     //we add the id od the user to get the user after decoding
//     return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
// } 

const User = mongoose.model("User", UserSchema);

module.exports = User;