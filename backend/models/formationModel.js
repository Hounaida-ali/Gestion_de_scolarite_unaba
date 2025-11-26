const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  code: { type: String, required: true },
  coefficient: { type: Number, required: true },
  credits: { type: Number, required: true },
  cm: { type: Number, default: 0 },
  td: { type: Number, default: 0 },
  totalHeures: { type: Number, required: true },
   niveau: {
    type: String,
    required: true,
    enum: ["L1", "L2", "L3"]
  }
});

const moduleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  cours: [coursSchema],
});

const ueSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  modules: [moduleSchema],
  totalCredits: { type: Number, required: true },
});

const semestreSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  nom: { type: String, required: true },
  ues: [ueSchema],
});

const niveauSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    enum: ["L1", "L2", "L3"], 
  },
  nom: { type: String, required: true },
  description: { type: String, required: true },
  semestres: [semestreSchema],
});

const programmeSchema = new mongoose.Schema({
  departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
    required: true,
  },
  code: { type: String, required: true },
  nom: { type: String, required: true },
  description: { type: String, required: true },
  duree: { type: String, required: true },
  credits: { type: String, required: true },
  diplome: { type: String, required: true },
  acces: { type: String, required: true },
  niveaux: [niveauSchema],
});

const FormationSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    departement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departement",
      required: true,
    },
    programmes: [programmeSchema],
  },
  {
    timestamps: true,
  }
);

const formationModel = mongoose.model("Formation", FormationSchema);
module.exports = formationModel;
