const express = require("express");
const router = express.Router();

const {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require("../controllers/scheduleController");

// Routes
router.get("/", getAllSchedules);
router.post("/", createSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

module.exports = router;
