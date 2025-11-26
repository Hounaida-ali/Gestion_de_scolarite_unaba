const Faculte = require('../models/FaculteModel'); 

// Créer une nouvelle faculté
const createFaculte = async (req, res) => {
  try {
    const { nomFaculte, adresse } = req.body;

    // Vérifier si la faculté existe déjà
    const existingFaculte = await Faculte.findOne({ nomFaculte });
    if (existingFaculte) {
      return res.status(400).json({ message: 'Cette faculté existe déjà.' });
    }

    // Créer la faculté si pas de doublon
    const faculte = new Faculte({ nomFaculte, adresse });
    const savedFaculte = await faculte.save();

    res.status(201).json(savedFaculte);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer toutes les facultés
const getAllFacultes = async (req, res) => {
  try {
    const facultes = await Faculte.find();
    res.status(200).json(facultes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une faculté par ID
const getFaculteById = async (req, res) => {
  try {
    const faculte = await Faculte.findById(req.params.id);
    if (!faculte) return res.status(404).json({ message: 'Faculté non trouvée' });
    res.status(200).json(faculte);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une faculté par ID
const updateFaculte = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomFaculte, adresse } = req.body;

    const faculte = await Faculte.findById(id);
    if (!faculte) return res.status(404).json({ message: 'Faculté non trouvée' });

    let isUpdated = false;

    if (nomFaculte && nomFaculte !== faculte.nomFaculte) {
      const existingFaculte = await Faculte.findOne({ nomFaculte });
      if (existingFaculte) return res.status(400).json({ message: 'Une faculté avec ce nom existe déjà.' });
      faculte.nomFaculte = nomFaculte;
      isUpdated = true;
    }

    if (adresse && adresse !== faculte.adresse) {
      faculte.adresse = adresse;
      isUpdated = true;
    }

    if (!isUpdated) {
      return res.status(200).json({ message: 'Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.' });
    }

    const updatedFaculte = await faculte.save();
    res.status(200).json(updatedFaculte);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une faculté par ID
const deleteFaculte = async (req, res) => {
  try {
    const faculte = await Faculte.findByIdAndDelete(req.params.id);
    if (!faculte) return res.status(404).json({ message: 'Faculté non trouvée' });
    res.status(200).json({ message: 'Faculté supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFaculte,
  getAllFacultes,
  getFaculteById,
  updateFaculte,
  deleteFaculte
};
