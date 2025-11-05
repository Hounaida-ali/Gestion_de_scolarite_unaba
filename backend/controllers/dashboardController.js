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
const updateDashboard = async (req, res) => {
  try {
    const dashboardId = req.params.id;
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

    // 🔹 Vérifier si le tableau de bord existe
    const currentDashboard = await dashboardModel.findById(dashboardId);
    if (!currentDashboard) {
      return res.status(404).json({
        success: false,
        message: "Tableau de bord non trouvé.",
      });
    }

    // 🔹 Fonction de comparaison pour les tableaux
    const areArraysEqual = (arr1 = [], arr2 = []) => {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
      if (arr1.length !== arr2.length) return false;
      return arr1.every((val, i) => val === arr2[i]);
    };

    // 🔹 Comparaison champ par champ
    const isSame =
      (currentDashboard.titre || "").trim() === (titre || "").trim() &&
      (currentDashboard.contenu || "").trim() === (contenu || "").trim() &&
      (currentDashboard.label || "").trim() === (label || "").trim() &&
      (currentDashboard.labelIcon || "").trim() === (labelIcon || "").trim() &&
      (currentDashboard.icon || "").trim() === (icon || "").trim() &&
      (currentDashboard.actionText || "").trim() === (actionText || "").trim() &&
      (currentDashboard.sousTitre || "").trim() === (sousTitre || "").trim() &&
      (currentDashboard.modalDescription || "").trim() === (modalDescription || "").trim() &&
      areArraysEqual(currentDashboard.details, details) &&
      (currentDashboard.status || "").trim() === (status || "").trim();

    if (isSame) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Construire l'objet de mise à jour (seulement les champs modifiés)
    const updateData = {};
    if ((titre || "").trim() !== (currentDashboard.titre || "").trim()) updateData.titre = titre;
    if ((contenu || "").trim() !== (currentDashboard.contenu || "").trim()) updateData.contenu = contenu;
    if ((label || "").trim() !== (currentDashboard.label || "").trim()) updateData.label = label;
    if ((labelIcon || "").trim() !== (currentDashboard.labelIcon || "").trim()) updateData.labelIcon = labelIcon;
    if ((icon || "").trim() !== (currentDashboard.icon || "").trim()) updateData.icon = icon;
    if ((actionText || "").trim() !== (currentDashboard.actionText || "").trim()) updateData.actionText = actionText;
    if ((sousTitre || "").trim() !== (currentDashboard.sousTitre || "").trim()) updateData.sousTitre = sousTitre;
    if ((modalDescription || "").trim() !== (currentDashboard.modalDescription || "").trim())
      updateData.modalDescription = modalDescription;
    if (!areArraysEqual(currentDashboard.details, details)) updateData.details = details;
    if ((status || "").trim() !== (currentDashboard.status || "").trim()) updateData.status = status;

    // 🔹 Si rien à mettre à jour (sécurité supplémentaire)
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Mise à jour dans la base de données
    const updatedDashboard = await dashboardModel.findByIdAndUpdate(
      dashboardId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Tableau de bord mis à jour avec succès !",
      data: updatedDashboard,
    });
  } catch (error) {
    return res.status(500).json({
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
