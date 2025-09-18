const express = require('express');
const router = express.Router();

const { register, login, verify, resetPassword, reinisilize, logout ,getAll} = require('../controllers/userController');

router.post("/register", register);
router.patch("/verify-email", verify);
router.post("/login", login);
router.patch("/resetpassword", resetPassword);
router.post("/reinisilize", reinisilize);
router.post("/logout", logout);
router.get("/getAll", getAll);

module.exports = router;