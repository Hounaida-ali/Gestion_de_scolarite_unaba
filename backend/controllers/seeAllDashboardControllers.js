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
    const dashboardId = req.params.id;
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

    // 🔹 Vérifier si l’élément existe
    const currentDashboard = await SeeAllDashboardModel.findById(dashboardId);
    if (!currentDashboard) {
      return res.status(404).json({
        success: false,
        message: "Élément du tableau de bord non trouvé.",
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
      (currentDashboard.titre || "").trim() === (titre || "").trim() &&
      (currentDashboard.contenu || "").trim() === (contenu || "").trim() &&
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

    // 🔹 Construire l’objet de mise à jour uniquement avec les champs modifiés
    const updateData = {};
    if ((titre || "").trim() !== (currentDashboard.titre || "").trim()) updateData.titre = titre;
    if ((contenu || "").trim() !== (currentDashboard.contenu || "").trim()) updateData.contenu = contenu;
    if ((icon || "").trim() !== (currentDashboard.icon || "").trim()) updateData.icon = icon;
    if ((actionText || "").trim() !== (currentDashboard.actionText || "").trim()) updateData.actionText = actionText;
    if ((sousTitre || "").trim() !== (currentDashboard.sousTitre || "").trim()) updateData.sousTitre = sousTitre;
    if ((modalDescription || "").trim() !== (currentDashboard.modalDescription || "").trim()) updateData.modalDescription = modalDescription;
    if (!areArraysEqual(currentDashboard.details, details)) updateData.details = details;
    if ((status || "").trim() !== (currentDashboard.status || "").trim()) updateData.status = status;

    // 🔹 Sécurité : aucun champ modifié
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Mise à jour dans la base de données
    const updatedDashboard = await SeeAllDashboardModel.findByIdAndUpdate(
      dashboardId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Élément du tableau de bord mis à jour avec succès !",
      data: updatedDashboard,
    });
  } catch (error) {
    console.error("Erreur updateSeeAllDashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l’élément du tableau de bord.",
      error: error.message,
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
