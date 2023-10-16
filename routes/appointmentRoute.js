const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
const { checkRole } = require("../middlewares/checkRole");

const {
  createAppointment,
  getAppointmentsOfUser,
} = require("../controllers/appointmentController");

router.post(
  "/createAppointment",
  checkAuth,
  checkRole(["User"]),
  createAppointment
);
router.get(
  "/getAppointmentsOfUser",
  checkAuth,
  checkRole(["User"]),
  getAppointmentsOfUser
);

module.exports = router;
