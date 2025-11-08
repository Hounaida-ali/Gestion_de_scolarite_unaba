const etudiantModel = require('../models/inscriptionModel');

// Générer un ID provisoire unique
const Counter = require('../models/counterModel'); // modèle de compteur

const synchroniserCounter = async () => {
  const dernierEtudiant = await etudiantModel
    .findOne()
    .sort({ dateInscription: -1 })
    .lean();

  if (dernierEtudiant && dernierEtudiant.idProvisoire) {
    const dernierNumero = parseInt(
      dernierEtudiant.idProvisoire.slice(-4),
      10
    );
    await Counter.findOneAndUpdate(
      { _id: 'etudiantId' },
      { seq: dernierNumero },
      { upsert: true }
    );
  } else {
    // Si aucun étudiant, initialise à 0
    await Counter.findOneAndUpdate(
      { _id: 'etudiantId' },
      { seq: 0 },
      { upsert: true }
    );
  }
};

// Générer un ID provisoire unique
const genererIdProvisoire = async () => {
  await synchroniserCounter();

  const prefix = 'PROV';
  const annee = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { _id: 'etudiantId' },
    { $inc: { seq: 1 } },   // incrémente de 1
    { new: true, upsert: true }
  );

  const numero = counter.seq.toString().padStart(4, '0');
  return `${prefix}${annee}${numero}`;
};


//  Créer un nouvel étudiant
const createEtudiant = async (req, res) => {
  try {
    const idProvisoire = await genererIdProvisoire();

    const photoEtudiant = req.body.photoEtudiant;

    const etudiant = new etudiantModel({
      ...req.body,
      idProvisoire,
      statut: 'en-attente',
      fraisInscription: 50000,
      dateInscription: new Date(),

       photo: photoEtudiant
        ? {
            filename: photoEtudiant.split('/').pop(),
            originalName: photoEtudiant.split('/').pop(),
            path: photoEtudiant.replace('http://localhost:5000/', 'public/'),
            url: photoEtudiant,
          }
        : null
    });
   
    await etudiant.save();

    res.status(201).json({
      message: `L'étudiant ${etudiant.nom} ${etudiant.prenom} a été enregistré avec succès.`,
      etudiant: {
        _id: etudiant._id,
        idProvisoire: etudiant.idProvisoire,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        statut: etudiant.statut,
        formation: etudiant.formation,
        dateInscription: etudiant.dateInscription,
        photo: etudiant.photo
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      const champ = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `Un étudiant avec ce ${champ} existe déjà. Veuillez en choisir un autre.`
      });
    }
    res.status(400).json({ message: error.message });
  }
};


//  Récupérer tous les étudiants
const getEtudiants = async (req, res) => {
  try {
    const etudiants = await etudiantModel.find().sort({ dateInscription: -1 });
    res.json(etudiants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Récupérer un étudiant par ID
const getEtudiantById = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Mettre à jour un étudiant
const updateEtudiant = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.json(etudiant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Supprimer un étudiant
const deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.json({ message: `L'étudiant ${etudiant.nom} ${etudiant.prenom} a été supprimé avec succès.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Valider une inscription
const validerInscription = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findByIdAndUpdate(
      req.params.id,
      { statut: 'valide' },
      { new: true }
    );
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Confirmer le paiement
const confirmerPaiement = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    etudiant.statut = 'paye';
    etudiant.genererNumeroEtudiant();

    await etudiant.save();
    res.json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exporter toutes les méthodes
module.exports = {
  createEtudiant,
  getEtudiants,
  getEtudiantById,
  updateEtudiant,
  deleteEtudiant,
  validerInscription,
  confirmerPaiement,
};
