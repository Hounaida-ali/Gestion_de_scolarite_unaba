const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
  idProvisoire: {
    type: String,
    unique: true,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telephone: {
    type: String,
    required: true
  },
  dateNaissance: {
    type: Date,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  codePostal: {
    type: String,
    required: true
  },
  departement: { 
    type: String, 
    required: true,enum: ['économie', 'droit', 'gestion'] },   // ex: économie, droit, gestion
  niveauEtudes: {
    type: String,
    required: true
  },
  formation: {
    type: String,
    required: true
  },
  modeFormation: {
    type: String,
    enum: ['presentiel', 'en-ligne'],
    required: true
  },
  documents: [{
    type: String
  }],
  statut: {
    type: String,
    enum: ['en-attente', 'valide', 'rejete', 'paye', 'confirme'],
    default: 'en-attente'
  },
  fraisInscription: {
    type: Number,
    default: 50000
  },
  dateInscription: {
    type: Date,
    default: Date.now
  },
  numeroEtudiant: {
    type: String,
    unique: true,
    sparse: true
  },
  photo: {
    filename: String,
    originalName: String,
    path: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }
});

// Génération automatique de l'ID provisoire
etudiantSchema.pre('save', async function(next) {
  if (this.isNew) {
    const annee = new Date().getFullYear();
    const count = await mongoose.model('Etudiant').countDocuments();
    this.idProvisoire = `PROV${annee}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Génération automatique du numéro d'étudiant après paiement
etudiantSchema.methods.genererNumeroEtudiant = function() {
  const annee = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  this.numeroEtudiant = `ETU${annee}${random}`;
  return this.numeroEtudiant;
};

const etudiantModel = mongoose.model('Etudiant', etudiantSchema);
module.exports = etudiantModel;