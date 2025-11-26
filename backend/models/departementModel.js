// models/departementModel.js
const mongoose = require("mongoose");

const departementSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    departement: { type: String, required: true, unique: true },
    faculteNom: { type: mongoose.Schema.Types.ObjectId, ref: "Faculte" },
    description: { type: String },
  },
  { timestamps: true }
);

const departementModel = mongoose.model("Departement", departementSchema);

module.exports = departementModel;
