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

    const updatedNews = await AllNewsModel.findByIdAndUpdate(
      req.params.id,
      {
        titre,
        contenu,
        date,
        actionText,
        sousTitre,
        modalDescription,
        details,
        status,
      },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: "Actualité non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Actualité mise à jour avec succès",
      data: updatedNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification de l’actualité",
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
