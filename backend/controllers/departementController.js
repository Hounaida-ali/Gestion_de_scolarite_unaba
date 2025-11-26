require("dotenv").config();
const departementModel = require("../models/departementModel");
const Faculte = require('../models/FaculteModel');


//  POST — Ajouter un nouveau département

const addDepartement = async (req, res) => {
  console.log("\nAdd Departement called.\n");
  
  try {
    const { nom, departement, faculteNom, description } = req.body;

    if (!nom || !departement || !faculteNom) {
      return res.status(400).json({
        success: false,
        message: "Le nom, le code du département et le nom de la faculté sont obligatoires.",
      });
    }

    // Vérifier que la faculté existe
    const faculte = await Faculte.findOne({ nomFaculte: faculteNom.trim() });
    if (!faculte) {
      return res.status(404).json({
        success: false,
        message: `Aucune faculté trouvée avec le nom '${faculteNom}'.`,
      });
    }

    // Vérifier doublon du département
    const existingDep = await departementModel.findOne({ departement: departement.trim() });
    if (existingDep) {
      return res.status(400).json({
        success: false,
        message: "Un département avec ce code existe déjà.",
      });
    }

    // Créer le département
    const newDep = new departementModel({
      nom,
      departement,
      faculteNom: faculte._id, // <- ici le nom du champ doit correspondre au modèle
      description
    });

    const savedDep = await newDep.save();

    res.status(201).json({
      success: true,
      message: "Département ajouté avec succès.",
      data: {
        ...savedDep._doc,
        faculte: {
          _id: faculte._id,
          nomFaculte: faculte.nomFaculte
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du département.",
      error: error.message,
    });
  }
};


//  GET — Récupérer tous les départements

const getAllDepartements = async (req, res) => {
  console.log("\nGet All Departements Called.\n");
  try {
    const departements = await departementModel.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'faculteNom', select: 'nomFaculte adresse' }); // <- utiliser le champ correct

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


//  GET — Récupérer un département par ID

const getDepartementById = async (req, res) => {
  try {
    const departementItem = await departementModel.findById(req.params.id)
      .populate({ path: 'faculteNom', select: 'nomFaculte adresse' });

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


//  PUT — Modifier un département

const updateDepartement = async (req, res) => {
  try {
    const { nom, departement, faculteNom, description } = req.body;

    // Récupérer le département existant
    const dep = await departementModel.findById(req.params.id).populate({ path: 'faculteNom', select: 'nomFaculte' });
    if (!dep) {
      return res.status(404).json({
        success: false,
        message: "Département non trouvé.",
      });
    }

    let isUpdated = false;

    // Comparer chaque champ
    if (nom && nom !== dep.nom) {
      dep.nom = nom;
      isUpdated = true;
    }

    if (departement && departement !== dep.departement) {
      dep.departement = departement;
      isUpdated = true;
    }

    if (description && description !== dep.description) {
      dep.description = description;
      isUpdated = true;
    }

    if (faculteNom) {
      const faculte = await Faculte.findOne({ nomFaculte: faculteNom.trim() });
      if (!faculte) {
        return res.status(404).json({
          success: false,
          message: `La faculté '${faculteNom}' n'existe pas.`,
        });
      }

      // Vérifier si le faculteNom a changé
      if (!dep.faculteNom || dep.faculteNom._id.toString() !== faculte._id.toString()) {
        dep.faculteNom = faculte._id;
        isUpdated = true;
      }
    }

    if (!isUpdated) {
      return res.status(200).json({
        success: false,
        message: "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    const updatedDep = await dep.save();

    // Renvoyer le département mis à jour avec la faculté peuplée
    await updatedDep.populate({ path: 'faculteNom', select: 'nomFaculte adresse' });

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



//  DELETE — Supprimer un département

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
