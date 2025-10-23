require('dotenv').config();
const QuickAccessModel = require('../models/QuickAccessModel');

// GET toutes les actualités
const getAllQuickAccess = async (req, res) => {
  try {
    const QuickAccess = await QuickAccessModel.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: QuickAccess,
      count: QuickAccess.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des accès rapide',
      error: error.message
    });
  }
};

// GET une actualité par ID
const getIdQuickAccess = async (req, res) => {
  try {
    const QuickAccess = await QuickAccessModel.findById(req.params.id);

    if (!QuickAccess) {
      return res.status(404).json({
        success: false,
        message: 'accès rapide  non trouvée'
      });
    }

    res.json({
      success: true,
      data: QuickAccess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'accès rapide',
      error: error.message
    });
  }
};

// POST créer une nouvelle actualité
const addQuickAccess = async (req, res) => {
  try {
    const { titre, contenu, icon, actionText } = req.body;

    // Validation simple
    if (!titre || !contenu || !icon || !actionText) {
      return res.status(400).json({
        success: false,
        message: 'Le titre, contenu , icon et actionText sont obligatoires'
      });
    }
    const existingQuickAccess = await QuickAccessModel.findOne({ titre: titre.trim() });
    if (existingQuickAccess) {
      return res.status(400).json({
        success: false,
        message: "Un accès rapide avec ce titre existe déjà"
      });
    }

    
    const nouvelleQuickAccess = new QuickAccessModel({
      titre,
      contenu,
      icon,
      actionText
    });

    await nouvelleQuickAccess.save();

    res.status(201).json({
      success: true,
      message: 'Accès rapide créée avec succès',
      data: nouvelleQuickAccess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'accès rapide',
      error: error.message
    });
  }
};

// PUT modifier une actualité
const updateQuickAccess = async (req, res) => {
  try {
    const { titre, contenu, icon, actionText} = req.body;

    const QuickAccess = await QuickAccessModel.findByIdAndUpdate(
      req.params.id,
      { 
        titre, 
        contenu,
        icon,
        actionText
      },
      { new: true }
    );

    if (!QuickAccess) {
      return res.status(404).json({
        success: false,
        message: 'Accès rapide non trouvée'
      });
    }

    res.json({
      success: true,
      message: ' Accès rapide modifiée avec succès',
      data: QuickAccess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'accès rapide',
      error: error.message
    });
  }
};

// DELETE supprimer une actualité
const deleteQuickAccess = async (req, res) => {
  try {
    const QuickAccess = await QuickAccessModel.findByIdAndDelete(req.params.id);

    if (!QuickAccess) {
      return res.status(404).json({
        success: false,
        message: 'Accès rapide non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Accès rapide supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'accès rapide',
      error: error.message
    });
  }
};

module.exports = {getAllQuickAccess, getIdQuickAccess, addQuickAccess, updateQuickAccess, deleteQuickAccess};