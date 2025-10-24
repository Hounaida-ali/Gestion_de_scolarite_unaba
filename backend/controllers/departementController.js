require("dotenv").config();
const departementModel = require("../models/departementModel");

// ============================
// 🔹 POST — Ajouter un nouveau département
// ============================
const addDepartement = async (req, res) => {
  try {
    const { nom, departement, description } = req.body;

    // Vérification des champs requis
    if (!nom || !departement) {
      return res.status(400).json({
        success: false,
        message: "Le nom et le code du département sont obligatoires.",
      });
    }

    // Vérifier si le département existe déjà
    const existingDep = await departementModel.findOne({ departement: departement.trim() });
    if (existingDep) {
      return res.status(400).json({
        success: false,
        message: "Un département avec ce nom existe déjà.",
      });
    }

    // Créer le nouveau département
    const newDep = new departementModel({
      nom,
      departement,
      description,
    });

    const savedDep = await newDep.save();

    res.status(201).json({
      success: true,
      message: "Département ajouté avec succès.",
      data: savedDep,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du département.",
      error: error.message,
    });
  }
};

// ============================
// 🔹 GET — Récupérer tous les départements
// ============================
const getAllDepartements = async (req, res) => {
  try {
    const departements = await departementModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: departements.length,
      data: departements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des départements.",
      error: error.message,
    });
  }
};

// ============================
// 🔹 GET — Récupérer un département par ID
// ============================
const getDepartementById = async (req, res) => {
  try {
    const departementItem = await departementModel.findById(req.params.id);

    if (!departementItem) {
      return res.status(404).json({
        success: false,
        message: "Département non trouvé.",
      });
    }

    res.json({
      success: true,
      data: departementItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du département.",
      error: error.message,
    });
  }
};

// ============================
// 🔹 PUT — Modifier un département
// ============================
const updateDepartement = async (req, res) => {
  try {
    const { nom, departement, description } = req.body;

    const updatedDep = await departementModel.findByIdAndUpdate(
      req.params.id,
      { nom, departement, description },
      { new: true }
    );

    if (!updatedDep) {
      return res.status(404).json({
        success: false,
        message: "Département non trouvé.",
      });
    }

    res.json({
      success: true,
      message: "Département mis à jour avec succès.",
      data: updatedDep,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du département.",
      error: error.message,
    });
  }
};

// ============================
// 🔹 DELETE — Supprimer un département
// ============================
const deleteDepartement = async (req, res) => {
  try {
    const deletedDep = await departementModel.findByIdAndDelete(req.params.id);

    if (!deletedDep) {
      return res.status(404).json({
        success: false,
        message: "Département non trouvé.",
      });
    }

    res.json({
      success: true,
      message: "Département supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du département.",
      error: error.message,
    });
  }
};

module.exports = {
  addDepartement,
  getAllDepartements,
  getDepartementById,
  updateDepartement,
  deleteDepartement,
};
