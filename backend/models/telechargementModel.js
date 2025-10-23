const mongoose = require('mongoose');

const telechargementSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ressource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ressource',
    required: true
  },
  dateTelechargement: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String
}, {
  timestamps: true
});

// Index composite
const telechargementModel= mongoose.model('Telechargement', telechargementSchema);

module.exports = telechargementModel;