require("dotenv").config();
const QuickAccessModel = require("../models/QuickAccessModel");

// ============================
// 🔹 GET — Récupérer tous les accès rapides
// ============================
const getAllQuickAccess = async (req, res) => {
  try {
    const quickAccessList = await QuickAccessModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quickAccessList,
      count: quickAccessList.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des accès rapides",
      error: error.message,
    });
  }
};

// ============================
// 🔹 GET — Récupérer un accès rapide par ID
// ============================
const getIdQuickAccess = async (req, res) => {
  try {
    const quickAccess = await QuickAccessModel.findById(req.params.id);

    if (!quickAccess) {
      return res.status(404).json({
        success: false,
        message: "Accès rapide non trouvé",
      });
    }

    res.json({
      success: true,
      data: quickAccess,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'accès rapide",
      error: error.message,
    });
  }
};

// ============================
// 🔹 POST — Créer un nouvel accès rapide
// ============================
const addQuickAccess = async (req, res) => {
  try {
    const {
      titre,
      contenu,
      icon,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    } = req.body;

    // ✅ Validation simple
    if (!titre || !contenu || !icon || !actionText) {
      return res.status(400).json({
        success: false,
        message: "Les champs titre, contenu, icon et actionText sont obligatoires.",
      });
    }

    // ✅ Vérifie si un Quick Access existe déjà
    const existingQuickAccess = await QuickAccessModel.findOne({ titre: titre.trim() });
    if (existingQuickAccess) {
      return res.status(400).json({
        success: false,
        message: "Un accès rapide avec ce titre existe déjà.",
      });
    }

    // ✅ Création du nouveau QuickAccess
    const newQuickAccess = new QuickAccessModel({
      titre,
      contenu,
      icon,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    });

    await newQuickAccess.save();

    res.status(201).json({
      success: true,
      message: "Accès rapide créé avec succès.",
      data: newQuickAccess,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'accès rapide.",
      error: error.message,
    });
  }
};

// ============================
// 🔹 PUT — Mettre à jour un accès rapide
// ============================
const updateQuickAccess = async (req, res) => {
  try {
    const {
      titre,
      contenu,
      icon,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    } = req.body;

    const updatedQuickAccess = await QuickAccessModel.findByIdAndUpdate(
      req.params.id,
      {
        titre,
        contenu,
        icon,
        actionText,
        sousTitre,
        modalDescription,
        details,
        status,
      },
      { new: true }
    );

    if (!updatedQuickAccess) {
      return res.status(404).json({
        success: false,
        message: "Accès rapide non trouvé.",
      });
    }

    res.json({
      success: true,
      message: "Accès rapide mis à jour avec succès.",
      data: updatedQuickAccess,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'accès rapide.",
      error: error.message,
    });
  }
};

// ============================
// 🔹 DELETE — Supprimer un accès rapide
// ============================
const deleteQuickAccess = async (req, res) => {
  try {
    const deletedQuickAccess = await QuickAccessModel.findByIdAndDelete(req.params.id);

    if (!deletedQuickAccess) {
      return res.status(404).json({
        success: false,
        message: "Accès rapide non trouvé.",
      });
    }

    res.json({
      success: true,
      message: "Accès rapide supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'accès rapide.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllQuickAccess,
  getIdQuickAccess,
  addQuickAccess,
  updateQuickAccess,
  deleteQuickAccess,
};
