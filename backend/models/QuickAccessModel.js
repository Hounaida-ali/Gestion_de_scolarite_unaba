const mongoose = require('mongoose');

const QuickAccessSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
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
  }
}, {
  timestamps: true
});

const QuickAccessModel = mongoose.model('QuickAccess', QuickAccessSchema);
module.exports = QuickAccessModel;