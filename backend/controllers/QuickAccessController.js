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
    const accessId = req.params.id;
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

    // 🔹 Vérifier si l’accès rapide existe
    const currentAccess = await QuickAccessModel.findById(accessId);
    if (!currentAccess) {
      return res.status(404).json({
        success: false,
        message: "Accès rapide non trouvé.",
      });
    }

    // 🔹 Fonction de comparaison pour les tableaux
    const areArraysEqual = (arr1 = [], arr2 = []) => {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
      if (arr1.length !== arr2.length) return false;
      return arr1.every((val, i) => val === arr2[i]);
    };

    // 🔹 Vérifier si tous les champs sont identiques
    const isSame =
      (currentAccess.titre || "").trim() === (titre || "").trim() &&
      (currentAccess.contenu || "").trim() === (contenu || "").trim() &&
      (currentAccess.icon || "").trim() === (icon || "").trim() &&
      (currentAccess.actionText || "").trim() === (actionText || "").trim() &&
      (currentAccess.sousTitre || "").trim() === (sousTitre || "").trim() &&
      (currentAccess.modalDescription || "").trim() === (modalDescription || "").trim() &&
      areArraysEqual(currentAccess.details, details) &&
      (currentAccess.status || "").trim() === (status || "").trim();

    if (isSame) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Construire l’objet de mise à jour uniquement avec les champs modifiés
    const updateData = {};
    if ((titre || "").trim() !== (currentAccess.titre || "").trim()) updateData.titre = titre;
    if ((contenu || "").trim() !== (currentAccess.contenu || "").trim()) updateData.contenu = contenu;
    if ((icon || "").trim() !== (currentAccess.icon || "").trim()) updateData.icon = icon;
    if ((actionText || "").trim() !== (currentAccess.actionText || "").trim()) updateData.actionText = actionText;
    if ((sousTitre || "").trim() !== (currentAccess.sousTitre || "").trim()) updateData.sousTitre = sousTitre;
    if ((modalDescription || "").trim() !== (currentAccess.modalDescription || "").trim()) updateData.modalDescription = modalDescription;
    if (!areArraysEqual(currentAccess.details, details)) updateData.details = details;
    if ((status || "").trim() !== (currentAccess.status || "").trim()) updateData.status = status;

    // 🔹 Sécurité : aucun champ modifié
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Mise à jour dans la base de données
    const updatedAccess = await QuickAccessModel.findByIdAndUpdate(
      accessId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Accès rapide mis à jour avec succès !",
      data: updatedAccess,
    });
  } catch (error) {
    console.error("Erreur updateQuickAccess:", error);
    return res.status(500).json({
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
