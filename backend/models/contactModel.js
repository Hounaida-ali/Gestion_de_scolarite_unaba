const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  lastName: {
  type:String,
  required:true
  },
  email: {
    type:String,
    required:true
    },
  message: {
    type:String,
    required:true
    },
    reply:  { 
      type: String, default: "" 
    },
  date: { type: Date, default: Date.now },
},
  { timestamps: true }
);

// Modèle
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;