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
  }
}, {
  timestamps: true
});

const dashboardModel = mongoose.model('Dashboard', dashboardSchema);
module.exports = dashboardModel;