const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    matiere: { type: String, required: true },
    departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
    required: true,
  },
  filiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formation",
    required: true,
  }, // ex: science-économie, finance, marketing
  niveau: {
    type: String,
    required: true,
  }, // niveau
    typeEvaluation: { 
        type: String, 
        enum: ['td', 'tp','controle'], // types autorisés
        required: true 
    },
    note: { type: Number, required: true, min: 0, max: 20 },
    commentaire: { type: String },
    dateCreation: { type: Date, default: Date.now }
});

const noteModel = mongoose.model('Note', noteSchema);
module.exports = noteModel;
