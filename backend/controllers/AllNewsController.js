require('dotenv').config();
const AllNewsModel = require('../models/AllNewsModel');

// ====================
// 🔹 GET — Récupérer toutes les actualités
// ====================
const getAllNews = async (req, res) => {
  try {
    const news = await AllNewsModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: news,
      count: news.length,
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
// 🔹 GET — Récupérer une actualité par ID
// ====================
const getNewsById = async (req, res) => {
  try {
    const newsItem = await AllNewsModel.findById(req.params.id);

    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: "Actualité non trouvée",
      });
    }

    res.json({
      success: true,
      data: newsItem,
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
// 🔹 POST — Créer une nouvelle actualité
// ====================
const addNews = async (req, res) => {
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

    // ✅ Validation
    if (!titre || !contenu || !date || !actionText) {
      return res.status(400).json({
        success: false,
        message: "Le titre, le contenu, la date et le texte d’action sont obligatoires",
      });
    }

    // ✅ Vérifie si une actualité avec le même titre existe déjà
    const existingNews = await AllNewsModel.findOne({ titre: titre.trim() });
    if (existingNews) {
      return res.status(400).json({
        success: false,
        message: "Une actualité avec ce titre existe déjà",
      });
    }

    // ✅ Création
    const newNews = new AllNewsModel({
      titre,
      contenu,
      date,
      actionText,
      sousTitre,
      modalDescription,
      details,
      status,
    });

    await newNews.save();

    res.status(201).json({
      success: true,
      message: "Actualité créée avec succès",
      data: newNews,
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
// 🔹 PUT — Modifier une actualité
// ====================
const updateNews = async (req, res) => {
  try {
    const newsId = req.params.id;
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
    const currentNews = await AllNewsModel.findById(newsId);
    if (!currentNews) {
      return res.status(404).json({
        success: false,
        message: "Actualité non trouvée.",
      });
    }

    // 🔹 Fonction de comparaison pour les tableaux
    const areArraysEqual = (arr1 = [], arr2 = []) => {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
      if (arr1.length !== arr2.length) return false;
      return arr1.every((val, i) => val === arr2[i]);
    };

    // 🔹 Vérifier si les champs sont identiques
    const isSame =
      (currentNews.titre || "").trim() === (titre || "").trim() &&
      (currentNews.contenu || "").trim() === (contenu || "").trim() &&
      new Date(currentNews.date).getTime() === new Date(date).getTime() &&
      (currentNews.actionText || "").trim() === (actionText || "").trim() &&
      (currentNews.sousTitre || "").trim() === (sousTitre || "").trim() &&
      (currentNews.modalDescription || "").trim() === (modalDescription || "").trim() &&
      areArraysEqual(currentNews.details, details) &&
      (currentNews.status || "").trim() === (status || "").trim();

    if (isSame) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Construire l’objet de mise à jour uniquement avec les champs modifiés
    const updateData = {};

    if ((titre || "").trim() !== (currentNews.titre || "").trim())
      updateData.titre = titre;

    if ((contenu || "").trim() !== (currentNews.contenu || "").trim())
      updateData.contenu = contenu;

    if (new Date(currentNews.date).getTime() !== new Date(date).getTime())
      updateData.date = date;

    if ((actionText || "").trim() !== (currentNews.actionText || "").trim())
      updateData.actionText = actionText;

    if ((sousTitre || "").trim() !== (currentNews.sousTitre || "").trim())
      updateData.sousTitre = sousTitre;

    if ((modalDescription || "").trim() !== (currentNews.modalDescription || "").trim())
      updateData.modalDescription = modalDescription;

    if (!areArraysEqual(currentNews.details, details))
      updateData.details = details;

    if ((status || "").trim() !== (currentNews.status || "").trim())
      updateData.status = status;

    // 🔹 Vérification de sécurité : aucun champ modifié
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Mise à jour dans la base
    const updatedNews = await AllNewsModel.findByIdAndUpdate(newsId, updateData, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Actualité mise à jour avec succès !",
      data: updatedNews,
    });
  } catch (error) {
    console.error("Erreur updateNews:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l’actualité.",
      error: error.message,
    });
  }
};

// ====================
// 🔹 DELETE — Supprimer une actualité
// ====================
const deleteNews = async (req, res) => {
  try {
    const deletedNews = await AllNewsModel.findByIdAndDelete(req.params.id);

    if (!deletedNews) {
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
  getAllNews,
  getNewsById,
  addNews,
  updateNews,
  deleteNews,
};
