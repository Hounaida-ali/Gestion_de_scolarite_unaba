require('dotenv').config();
const actualiteModel = require('../models/actualiteModel');

// ====================
// 🔹 Récupérer toutes les actualités
// ====================
const getAllActualite = async (req, res) => {
  try {
    const actualites = await actualiteModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: actualites,
      count: actualites.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des actualités",
      error: error.message,
    });
  }
};

// ====================
// 🔹 Récupérer une actualité par ID
// ====================
const getIdActualite = async (req, res) => {
  try {
    const actualite = await actualiteModel.findById(req.params.id);

    if (!actualite) {
      return res.status(404).json({
        success: false,
        message: "Actualité non trouvée",
      });
    }

    res.json({
      success: true,
      data: actualite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'actualité",
      error: error.message,
    });
  }
};

// ====================
// 🔹 Ajouter une nouvelle actualité
// ====================
const addActualite = async (req, res) => {
  try {
    const {
      titre,
      contenu,
      date,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    } = req.body;

    // ✅ Validation basique
    if (!titre || !contenu || !date || !actionText) {
      return res.status(400).json({
        success: false,
        message: "Le titre, le contenu, la date et le texte d’action sont obligatoires",
      });
    }

    // ✅ Vérifie si une actualité avec le même titre existe déjà
    const existingActualite = await actualiteModel.findOne({ titre: titre.trim() });
    if (existingActualite) {
      return res.status(400).json({
        success: false,
        message: "Une actualité avec ce titre existe déjà",
      });
    }

    // ✅ Création de l’actualité
    const nouvelleActualite = new actualiteModel({
      titre,
      contenu,
      date,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    });

    await nouvelleActualite.save();

    res.status(201).json({
      success: true,
      message: "Actualité créée avec succès",
      data: nouvelleActualite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l’actualité",
      error: error.message,
    });
  }
};

// ====================
// 🔹 Modifier une actualité existante
// ====================
const updateActualite = async (req, res) => {
  try {
    const actualiteId = req.params.id;
    const {
      titre,
      contenu,
      date,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    } = req.body;

    // 🔹 Vérifier si l’actualité existe
    const currentActualite = await actualiteModel.findById(actualiteId);
    if (!currentActualite) {
      return res.status(404).json({
        success: false,
        message: "Actualité non trouvée.",
      });
    }

    // 🔹 Comparateur pour les tableaux
    const areArraysEqual = (arr1 = [], arr2 = []) => {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
      if (arr1.length !== arr2.length) return false;
      return arr1.every((val, i) => val === arr2[i]);
    };

    // 🔹 Vérifier si les champs sont identiques
    const isSame =
      (currentActualite.titre || "").trim() === (titre || "").trim() &&
      (currentActualite.contenu || "").trim() === (contenu || "").trim() &&
      new Date(currentActualite.date).getTime() === new Date(date).getTime() &&
      (currentActualite.actionText || "").trim() === (actionText || "").trim() &&
      (currentActualite.sousTitre || "").trim() === (sousTitre || "").trim() &&
      (currentActualite.modalDescription || "").trim() === (modalDescription || "").trim() &&
      areArraysEqual(currentActualite.details, details) &&
      (currentActualite.status || "").trim() === (status || "").trim();

    if (isSame) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Créer un objet contenant uniquement les champs modifiés
    const updateData = {};

    if ((titre || "").trim() !== (currentActualite.titre || "").trim())
      updateData.titre = titre;
    if ((contenu || "").trim() !== (currentActualite.contenu || "").trim())
      updateData.contenu = contenu;
    if (new Date(currentActualite.date).getTime() !== new Date(date).getTime())
      updateData.date = date;
    if ((actionText || "").trim() !== (currentActualite.actionText || "").trim())
      updateData.actionText = actionText;
    if ((sousTitre || "").trim() !== (currentActualite.sousTitre || "").trim())
      updateData.sousTitre = sousTitre;
    if ((modalDescription || "").trim() !== (currentActualite.modalDescription || "").trim())
      updateData.modalDescription = modalDescription;
    if (!areArraysEqual(currentActualite.details, details))
      updateData.details = details;
    if ((status || "").trim() !== (currentActualite.status || "").trim())
      updateData.status = status;

    // 🔹 Vérifier s’il y a des modifications
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Effectuer la mise à jour
    const updatedActualite = await actualiteModel.findByIdAndUpdate(
      actualiteId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Actualité mise à jour avec succès !",
      data: updatedActualite,
    });
  } catch (error) {
    console.error("Erreur updateActualite:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l’actualité.",
      error: error.message,
    });
  }
};

// ====================
// 🔹 Supprimer une actualité
// ====================
const deleteActualite = async (req, res) => {
  try {
    const actualite = await actualiteModel.findByIdAndDelete(req.params.id);

    if (!actualite) {
      return res.status(404).json({
        success: false,
        message: "Actualité non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Actualité supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l’actualité",
      error: error.message,
    });
  }
};

module.exports = {
  getAllActualite,
  getIdActualite,
  addActualite,
  updateActualite,
  deleteActualite,
};
