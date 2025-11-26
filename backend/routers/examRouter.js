const express = require("express");
const router = express.Router();

const {
  getAllExams,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

// Routes
router.get("/", getAllExams);
router.post("/", createExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

module.exports = router;
