const mongoose = require("mongoose");

const faculteSchema = new mongoose.Schema({
  nomFaculte: { type: String, required: true },
  adresse: { type: String }
});

module.exports = mongoose.model("Faculte", faculteSchema);
