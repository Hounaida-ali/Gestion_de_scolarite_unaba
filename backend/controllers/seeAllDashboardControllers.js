require('dotenv').config();
const SeeAllDashboardModel = require('../models/seeAllDashboardModel');

// 🟢 GET — Récupérer tous les éléments du tableau de bord
const getAllSeeAllDashboard = async (req, res) => {
  try {
    const seeAllItems = await SeeAllDashboardModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: seeAllItems,
      count: seeAllItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des éléments du tableau de bord',
      error: error.message
    });
  }
};

// 🔵 GET — Récupérer un élément par ID
const getIdSeeAllDashboard = async (req, res) => {
  try {
    const seeAllItem = await SeeAllDashboardModel.findById(req.params.id);

    if (!seeAllItem) {
      return res.status(404).json({
        success: false,
        message: 'Élément du tableau de bord non trouvé'
      });
    }

    res.json({
      success: true,
      data: seeAllItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'élément du tableau de bord",
      error: error.message
    });
  }
};

// 🟣 POST — Créer un nouvel élément
const addSeeAllDashboard = async (req, res) => {
  try {
    const { titre, contenu, icon, actionText, sousTitre, modalDescription, details, status } = req.body;

    if (!titre || !contenu || !icon || !actionText) {
      return res.status(400).json({
        success: false,
        message: 'Les champs titre, contenu, icon et actionText sont obligatoires'
      });
    }

    const existingItem = await SeeAllDashboardModel.findOne({ titre: titre.trim() });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Un élément avec ce titre existe déjà"
      });
    }

    const newItem = new SeeAllDashboardModel({
      titre,
      contenu,
      icon,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Élément créé avec succès',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'élément du tableau de bord",
      error: error.message
    });
  }
};

// 🟡 PUT — Modifier un élément
const updateSeeAllDashboard = async (req, res) => {
  try {
    const { titre, contenu, icon, actionText, sousTitre, modalDescription, details, status } = req.body;

    const updatedItem = await SeeAllDashboardModel.findByIdAndUpdate(
      req.params.id,
      { titre, contenu, icon, actionText, sousTitre, modalDescription, details, status },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Élément non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Élément modifié avec succès',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification de l'élément du tableau de bord",
      error: error.message
    });
  }
};

// 🔴 DELETE — Supprimer un élément
const deleteSeeAllDashboard = async (req, res) => {
  try {
    const deletedItem = await SeeAllDashboardModel.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Élément non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Élément supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'élément du tableau de bord",
      error: error.message
    });
  }
};

module.exports = {
  getAllSeeAllDashboard,
  getIdSeeAllDashboard,
  addSeeAllDashboard,
  updateSeeAllDashboard,
  deleteSeeAllDashboard
};
