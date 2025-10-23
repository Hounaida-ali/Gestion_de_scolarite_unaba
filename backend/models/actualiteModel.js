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
  }
}, {
  timestamps: true
});

const actualiteModel = mongoose.model('Actualite', actualiteSchema);
module.exports = actualiteModel;