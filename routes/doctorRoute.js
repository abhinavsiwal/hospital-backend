const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
const { checkRole } = require("../middlewares/checkRole");

const {createDoctor,updateDoctor} = require("../controllers/doctorController");


router.post("/createDoctor", checkAuth, checkRole(["Admin"]), createDoctor);
router.put("/updateDoctor/:id", checkAuth, checkRole(["Admin","Doctor"]), updateDoctor);

module.exports = router;
