const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const argon2 = require("argon2");
const moment = require("moment");

exports.createDoctor = [
  body("name").notEmpty().withMessage("Please enter a valid name."),
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Please enter a valid phone number."),
  body("price").notEmpty().withMessage("Please enter a valid price."),
  body("services").notEmpty().withMessage("Please enter a valid services."),
  body("specialization")
    .notEmpty()
    .withMessage("Please enter a valid specialization."),
  body("education").notEmpty().withMessage("Please enter a valid education."),
  body("experience").notEmpty().withMessage("Please enter a valid experience."),
  body("profilePic").notEmpty().withMessage("Please enter a valid profilePic."),
  body("username").notEmpty().withMessage("Please enter a valid username."),
  body("gender").notEmpty().withMessage("Please enter a valid Gender"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    try {
      let existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        const error = new Error("User already exists.");
        error.status = 401;
        return next(error);
      }
      const hash = await argon2.hash(req.body.password);

      req.body.password = hash;
      req.body.role = "Doctor";

      const newUser = new User(req.body);
      await newUser.save();

      res.status(201).json({
        message: "Doctor Created successfully.",
        doctor: newUser,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Signup failed.");
      error.status = 401;
      return next(error);
    }
  },
];
exports.updateDoctor = [
  body("name").notEmpty().withMessage("Please enter a valid name."),
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Please enter a valid phone number."),
  body("price").notEmpty().withMessage("Please enter a valid price."),
  body("services").notEmpty().withMessage("Please enter a valid services."),
  body("specialization")
    .notEmpty()
    .withMessage("Please enter a valid specialization."),
  body("education").notEmpty().withMessage("Please enter a valid education."),
  body("experience").notEmpty().withMessage("Please enter a valid experience."),
  body("profilePic").notEmpty().withMessage("Please enter a valid profilePic."),
  body("username").notEmpty().withMessage("Please enter a valid username."),
  body("gender").notEmpty().withMessage("Please enter a valid Gender"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    try {
      const existingDoctor = await User.findOne({ _id: req.params.id });
      if (!existingDoctor) {
        const error = new Error("Doctor not found.");
        error.status = 404;
        return next(error);
      }

      const updatedDoctor = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json({
        message: "Doctor Updated successfully.",
        doctor: updatedDoctor,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Signup failed.");
      error.status = 401;
      return next(error);
    }
  },
];
