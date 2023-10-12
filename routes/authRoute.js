const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendOtp,
  verifyOtp,
  resendOtp,
  createNewPassword,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendOtp", sendOtp);
router.post("/resendOtp", resendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/createNewPassword", createNewPassword);
module.exports = router;
