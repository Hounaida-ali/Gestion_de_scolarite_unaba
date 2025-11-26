const mongoose = require("mongoose");

const enseignantSchema = new mongoose.Schema({
  matricule: {
    type: String,
    unique: true,
  },

  nom: {
    type: String,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  dateNaissance: {
    type: Date,
    required: true,
  },
  specialite: {
    type: String,
    required: true,
    enum: [
      "Informatique",
      "Économie",
      "Droit",
      "Gestion",
      "Mathématiques",
      "Physique",
      "Chimie",
      "Lettres",
    ],
  },
  grade: {
    type: String,
    required: true,
    enum: [
      "Professeur",
      "Maître de Conférences",
      "Maître Assistant",
      "Assistant",
      "Vacataire",
    ],
  },
  departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
    required: true,
  },
  dateEmbauche: {
    type: Date,
    required: true,
  },
  statut: {
    type: String,
    enum: ["actif", "inactif", "congé", "retraité"],
    default: "actif",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  coursAffectes: [
    {
      type: String,
      required: true,
    },
  ],
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

// Génération automatique du matricule
enseignantSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const dernierEnseignant = await mongoose
        .model("Enseignant")
        .findOne()
        .sort({ matricule: -1 });

      let nouveauNumero = 1;

      if (dernierEnseignant && dernierEnseignant.matricule) {
        const dernierNumero = parseInt(dernierEnseignant.matricule.slice(-4));
        if (!isNaN(dernierNumero)) {
          nouveauNumero = dernierNumero + 1;
        }
      }

      const annee = new Date().getFullYear();
      this.matricule = `ENS${annee}${nouveauNumero
        .toString()
        .padStart(4, "0")}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});
const EnseignantModel = mongoose.model("Enseignant", enseignantSchema);
module.exports = EnseignantModel;
