const mongoose = require('mongoose');

const actualiteSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  actionText: {       
    type: String,
    required: true,
    trim: true
  },
  // Champs pour le contenu dynamique du modal
    sousTitre: {
      type: String,
      default: "",
      trim: true,
    },
    modalDescription: {
      type: String,
      default: "",
      trim: true,
    },
    details: {
      type: [String], // tableau de lignes (bullet points)
      default: [],
    },
    status: {
      type: String,
      default: "",
      trim: true,
    },
}, {
  timestamps: true
});

const actualiteModel = mongoose.model('Actualite', actualiteSchema);
module.exports = actualiteModel;