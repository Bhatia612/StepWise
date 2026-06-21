const express = require("express");
const authController = require("../controllers/auth.controller");
const { validateSignup, validateLogin } = require("../middlewares/validateAuth.middleware");

const router = express.Router();

router.post("/signup", validateSignup, authController.signUpController);
router.post("/login", validateLogin, authController.logInController);
router.post("/logout", authController.logOutController);

module.exports = router;