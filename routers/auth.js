const express = require('express');
const router = express.Router();

const { register,login,forgotpassword } = require('../controllers/auth');
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);

module.exports = router;