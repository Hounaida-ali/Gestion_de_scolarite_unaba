const mongoose = require('mongoose');

// Define sub-schema for File
const fileSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  taille: {
    type: Number,
    required: true // in bytes
  },
  type: {
    type: String,
    required: true // e.g. 'pdf', 'docx', etc.
  }
}, { _id: false }); // no separate _id for subdocument

const ressourceSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['cours', 'td', 'tp']
  },
  niveau: {
    type: String,
    required: true,
    enum: ['licence1','licence2','licence3']
  },
  matiere: {
    type: String,
    required: true,
    // enum: ['microeconomie', 'gestion entreprise', 'statistiques', 'mathematiques', 'francais','sysyteme information']
  },
  fichier: { type: fileSchema, required: true },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  datePublication: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  estPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
const ressourceModel = mongoose.model('Ressource', ressourceSchema);

module.exports = ressourceModel;