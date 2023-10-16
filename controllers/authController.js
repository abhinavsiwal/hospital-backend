const User = require("../models/User");
const { createJwtToken } = require("../utils/createToken");
const { body, validationResult } = require("express-validator");
const { Otp } = require("../utils/generateOtp");
const { verifyJwtToken } = require("../utils/verifyToken");
const argon2 = require("argon2");
const moment = require("moment");
exports.login = [
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { email, password } = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      console.log(err);
      const error = new Error("User not found.");
      error.status = 401;
      return next(error);
    }

    if (!existingUser) {
      const error = new Error("Kindly enter the valid email address");
      error.status = 401;
      return next(error);
    }
    const isMathched = await argon2.verify(existingUser.password, password);

    if (!isMathched) {
      const error = new Error("Kindly enter the correct password");
      error.status = 401;
      return next(error);
    }

    let token;
    try {
      token = createJwtToken({ userId: existingUser._id });
    } catch (error) {
      return next(error);
    }

    res.status(200).json({
      message: "Login success.",
      token,
      user: existingUser,
    });
  },
];

exports.signup = [
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role").notEmpty().withMessage("Please enter a valid role."),
  body("name").notEmpty().withMessage("Please enter a valid name."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { email, password, role, name } = req.body;
    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("User already exists.");
        error.status = 401;
        return next(error);
      }

      const hash = await argon2.hash(password);

      const newUser = new User({
        email,
        password: hash,
        role,
        name,
      });
      await newUser.save();

      let token;
      try {
        token = createJwtToken({ userId: newUser._id });
      } catch (error) {
        return next(error);
      }

      res.status(201).json({
        message: "Signup successfully.",
        user: newUser,
        token,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Signup failed.");
      error.status = 401;
      return next(error);
    }
  },
];

exports.sendOtp = [
  body("email").isEmail().withMessage("Please enter a valid email address."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("User not found with this Email .");
        error.status = 401;
        return next(error);
      }

      const otp = Otp();
      user.otp = otp;
      user.otpCreatedAt = Date.now();
      await user.save();

      const token = createJwtToken({ userId: user._id });

      res.status(200).json({
        message: `OTP sent to your email==>${otp}`,
        token,
      });
    } catch (error) {
      console.log(error);
      const err = new Error("Something went wrong.");
      err.status = 500;
      return next(err);
    }
  },
];

exports.resendOtp = [
  body("token").notEmpty().withMessage("Please enter a valid token."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    try {
      const { token } = req.body;
      const userId = verifyJwtToken(token, next);

      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found.");
        error.status = 401;
        return next(error);
      }
      const otp = Otp();
      user.otp = otp;
      user.otpCreatedAt = Date.now();
      await user.save();

      const newToken = createJwtToken({ userId: user._id });

      res.status(200).json({
        message: `OTP sent to your email==>${otp}`,
        token: newToken,
      });
    } catch (error) {}
  },
];

exports.verifyOtp = [
  body("otp").isLength({ min: 4 }).withMessage("Please enter a valid OTP."),
  body("token").notEmpty().withMessage("Please enter a valid token."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { otp, token } = req.body;

    try {
      const userId = verifyJwtToken(token, next);
      console.log(userId);

      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found.");
        error.status = 401;
        return next(error);
      }

      if (user.otp !== otp) {
        const error = new Error("Invalid OTP.");
        error.status = 401;
        return next(error);
      }

      const otpExpired = moment()
        .subtract(1, "minutes")
        .isAfter(user.otpCreatedAt);
      if (otpExpired) {
        const error = new Error("OTP expired.");
        error.status = 401;
        return next(error);
      }

      user.otp = undefined;
      user.otpCreatedAt = undefined;
      await user.save();

      const newToken = createJwtToken({ userId: user._id });

      res.status(200).json({
        message: "OTP verified.",
        token: newToken,
      });
    } catch (error) {
      console.log(error);
      const err = new Error("Something went wrong.");
      err.status = 500;
      return next(err);
    }
  },
];

exports.createNewPassword = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("token").notEmpty().withMessage("Please enter a valid token."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { password, token } = req.body;

    try {
      const userId = verifyJwtToken(token, next);

      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found.");
        error.status = 401;
        return next(error);
      }

      const hash = await argon2.hash(password);
      user.password = hash;
      await user.save();

      res.status(200).json({
        message: "Password updated Successfully.",
      });
    } catch (error) {
      console.log(error);
      const err = new Error("Something went wrong.");
      err.status = 500;
      return next(err);
    }
  },
];
