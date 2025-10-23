require('dotenv').config();
const path = require('path');

const upload = require('../middlewares/multerConfig');
const Telechargement = require('../models/telechargementModel');
const Ressource = require('../models/ressourceModel');
const authMiddleware = require('../middlewares/authMiddleware');

// POST enregistrer un téléchargement
const addTelechargement = async (req, res) => {
  try {
    const { ressourceId } = req.body;

    const ressource = await Ressource.findById(ressourceId);
    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    // Enregistrer le téléchargement
    const telechargement = new Telechargement({
      utilisateur: req.user.userId,
      ressource: ressourceId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    await telechargement.save();
    
    // Incrémenter le compteur de téléchargements de la ressource
    await Ressource.findByIdAndUpdate(ressourceId, {
      $inc: { nombreTelechargements: 1 }
    });

    // Récupérer le nom du fichier à partir de l'URL de la ressource
    const fichierNom = path.basename(ressource.fichier.url); // récupère juste le nom du fichier
    const fichierUrl = `${req.protocol}://${req.get('host')}/uploads/${fichierNom}`;

    res.status(201).json({
      message: 'Téléchargement enregistré',
      fichierUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET historique des téléchargements d'un utilisateur
const getHistorique = async (req, res) => {
  try {
    const telechargements = await Telechargement.find({ utilisateur: req.user.userId })
      .populate('ressource')
      .sort({ dateTelechargement: -1 });

    res.json({
      nombreTelechargements: telechargements.length,
      telechargements
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};


module.exports = { addTelechargement, getHistorique };