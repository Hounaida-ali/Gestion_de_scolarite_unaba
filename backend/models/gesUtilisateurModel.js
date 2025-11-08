const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { 
        type: String, 
        enum: ['enseignant', 'etudiant', 'administrateur'], 
        default: 'etudiant' 
    },
    dateCreation: { type: Date, default: Date.now },
    statut: { 
        type: String, 
        enum: ['actif', 'inactif', 'suspendu'], 
        default: 'actif' 
    }
});

const userModel = mongoose.model('Utilisateur', userSchema);
module.exports = userModel;
