require('dotenv').config();
const actualiteModel = require('../models/actualiteModel');

// GET toutes les actualités
const getAllActualite = async (req, res) => {
  try {
    const actualites = await actualiteModel.find()
      .sort({ datePublication: -1 });

    res.json({
      success: true,
      data: actualites,
      count: actualites.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des actualités',
      error: error.message
    });
  }
};

// GET une actualité par ID
const getIdActualite = async (req, res) => {
  try {
    const actualite = await actualiteModel.findById(req.params.id);

    if (!actualite) {
      return res.status(404).json({
        success: false,
        message: 'Actualité non trouvée'
      });
    }

    res.json({
      success: true,
      data: actualite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'actualité',
      error: error.message
    });
  }
};

// POST créer une nouvelle actualité
const addActualite = async (req, res) => {
  try {
    const { titre, contenu, date, actionText } = req.body;

    // Validation simple
    if (!titre || !contenu || !actionText) {
      return res.status(400).json({
        success: false,
        message: 'Le titre, le contenu, le action et le icon sont obligatoires'
      });
    }
    const existingActualite = await actualiteModel.findOne({ titre: titre.trim() });
    if (existingActualite) {
      return res.status(400).json({
        success: false,
        message: "Une actualité avec ce titre existe déjà"
      });
    }

    
    const nouvelleActualite = new actualiteModel({
      titre,
      contenu,
      date,
      actionText
    });

    await nouvelleActualite.save();

    res.status(201).json({
      success: true,
      message: 'Actualité créée avec succès',
      data: nouvelleActualite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'actualité',
      error: error.message
    });
  }
};

// PUT modifier une actualité
const updateActualite = async (req, res) => {
  try {
    const { titre, contenu, date, actionText } = req.body;

    const actualite = await actualiteModel.findByIdAndUpdate(
      req.params.id,
      { 
        titre, 
        contenu,
        date,
        actionText
      },
      { new: true }
    );

    if (!actualite) {
      return res.status(404).json({
        success: false,
        message: 'Actualité non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Actualité modifiée avec succès',
      data: actualite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'actualité',
      error: error.message
    });
  }
};

// DELETE supprimer une actualité
const deleteActualite = async (req, res) => {
  try {
    const actualite = await actualiteModel.findByIdAndDelete(req.params.id);

    if (!actualite) {
      return res.status(404).json({
        success: false,
        message: 'Actualité non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Actualité supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'actualité',
      error: error.message
    });
  }
};

module.exports = {getAllActualite, getIdActualite, addActualite, updateActualite, deleteActualite};