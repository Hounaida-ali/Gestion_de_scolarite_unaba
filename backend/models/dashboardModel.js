const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
  },
  label: {           
    type: String,
    required: true,
    trim: true
  },
  labelIcon: {            
    type: String,
    required: true,
    trim: true
  },
  icon: {            
    type: String,
    required: true,
    trim: true
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

const dashboardModel = mongoose.model('Dashboard', dashboardSchema);
module.exports = dashboardModel;