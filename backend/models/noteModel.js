const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    matiere: { type: String, required: true },
    departement: { type: String, required: true,enum: ['économie', 'droit', 'gestion'] },   // ex: économie, droit, gestion
    filiere: { type: String, required: true, enum: ['science-économie', 'gestion', 'droit', 'économie-monaiteur'] },      // ex: science-économie, finance, marketing
    niveau: { type: String, required: true, enum: ['licence1', 'licence2', 'licence3'] },  // niveau
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
