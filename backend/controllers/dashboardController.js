require('dotenv').config();
const dashboardModel = require('../models/dashboardModel');

// ==========================
// 🔹 GET — Récupérer tous les dashboards
// ==========================
const getAllDashboards = async (req, res) => {
  try {
    const dashboards = await dashboardModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: dashboards,
      count: dashboards.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des tableaux de bord",
      error: error.message,
    });
  }
};

// ==========================
// 🔹 GET — Récupérer un dashboard par ID
// ==========================
const getDashboardById = async (req, res) => {
  try {
    const dashboard = await dashboardModel.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Tableau de bord non trouvé",
      });
    }

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du tableau de bord",
      error: error.message,
    });
  }
};

// ==========================
// 🔹 POST — Créer un nouveau dashboard
// ==========================
const addDashboard = async (req, res) => {
  try {
    const {
      titre,
      contenu,
      label,
      labelIcon,
      icon,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    } = req.body;

    // ✅ Validation de base
    if (!titre || !contenu || !label || !labelIcon || !icon || !actionText) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis.",
      });
    }

    // ✅ Vérifie si un dashboard avec le même titre existe déjà
    const existingDashboard = await dashboardModel.findOne({ titre: titre.trim() });
    if (existingDashboard) {
      return res.status(400).json({
        success: false,
        message: "Un tableau de bord avec ce titre existe déjà.",
      });
    }

    // ✅ Création du nouveau dashboard
    const newDashboard = new dashboardModel({
      titre,
      contenu,
      label,
      labelIcon,
      icon,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    });

    await newDashboard.save();

    res.status(201).json({
      success: true,
      message: "Tableau de bord créé avec succès.",
      data: newDashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du tableau de bord.",
      error: error.message,
    });
  }
};

// ==========================
// 🔹 PUT — Modifier un dashboard existant
// ==========================
const updateDashboard = async (req, res) => {
  try {
    const {
      titre,
      contenu,
      label,
      labelIcon,
      icon,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    } = req.body;

    const updatedDashboard = await dashboardModel.findByIdAndUpdate(
      req.params.id,
      {
        titre,
        contenu,
        label,
        labelIcon,
        icon,
        actionText,
        sousTitre,
        modalDescription,
        details,
        status,
      },
      { new: true }
    );

    if (!updatedDashboard) {
      return res.status(404).json({
        success: false,
        message: "Tableau de bord non trouvé.",
      });
    }

    res.json({
      success: true,
      message: "Tableau de bord mis à jour avec succès.",
      data: updatedDashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du tableau de bord.",
      error: error.message,
    });
  }
};

// ==========================
// 🔹 DELETE — Supprimer un dashboard
// ==========================
const deleteDashboard = async (req, res) => {
  try {
    const deletedDashboard = await dashboardModel.findByIdAndDelete(req.params.id);

    if (!deletedDashboard) {
      return res.status(404).json({
        success: false,
        message: "Tableau de bord non trouvé.",
      });
    }

    res.json({
      success: true,
      message: "Tableau de bord supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du tableau de bord.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDashboards,
  getDashboardById,
  addDashboard,
  updateDashboard,
  deleteDashboard,
};
