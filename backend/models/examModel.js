const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  type: { type: String, enum: ["examen", "controle"], default: "examen" },
  departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
    required: true,
  },
  filiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formation",
    required: true,
  }, // ex: science-économie, finance, marketing
  niveau: {
    type: String,
    required: true,
  }, // niveau
  room: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  notified: { type: Boolean, default: false },
});

const ExamModel = mongoose.model("Exam", examSchema);
module.exports = ExamModel;
