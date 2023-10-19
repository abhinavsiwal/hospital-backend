const Appointment = require("../models/Appointment");

const { body, validationResult } = require("express-validator");
const moment = require("moment");
const { sendMail } = require("../utils/sendEmail");

exports.createAppointment = [
  body("date").notEmpty().withMessage("Please enter a valid date."),
  body("time").notEmpty().withMessage("Please enter a valid time."),
  body("mode").notEmpty().withMessage("Please enter a valid mode."),
  body("doctor").notEmpty().withMessage("Please enter a valid doctor Id."),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { date, time, mode, agenda, doctor } = req.body;
    const userId = req.user._id;

    try {
      const newAppointment = new Appointment({
        date,
        time,
        mode,
        agenda,
        doctor,
        user: userId,
      });
      await newAppointment.save();
      const body = `Your appointment has been created for ${date} at ${time}.`;
      const result = await sendMail(
        req.user?.email,
        "Appointment Scheduled",
        body
      );
      console.log(result);
      res.status(201).json({
        message: "Appointment created.",
        appointment: newAppointment,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Appointment creation failed.");
      error.status = 500;
      return next(error);
    }
  },
];

exports.getAppointmentsOfUser = async (req, res, next) => {
  const userId = req.user._id;
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);
  if (startDate && endDate) {
    console.log("here");
    try {
      const appointments = await Appointment.find({
        user: userId,
        date: {
          $gte: moment(startDate).startOf("day"),
          $lte: moment(endDate).endOf("day"),
        },
      });
      res.status(200).json({
        message: "Appointments fetched.",
        appointments,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Fetching appointments failed.");
      error.status = 500;
      return next(error);
    }
  } else {
    try {
      const appointments = await Appointment.find({ user: userId });
      res.status(200).json({
        message: "Appointments fetched.",
        appointments,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Fetching appointments failed.");
      error.status = 500;
      return next(error);
    }
  }
};
