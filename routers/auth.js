const express = require('express');
const router = express.Router();

const { register,login } = require('../controllers/auth');
router.route("/register").post(register);
router.route("/login").post(login);
// router.route("/forgetpassword").put(forgetpassword);

module.exports = router;