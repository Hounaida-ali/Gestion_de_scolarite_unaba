const mongoose = require("mongoose");
const scheduleModel = require("../models/scheduleModel");
const Enseignant = require("../models/enseignantModel");
const User = require("../models/userModel");
const departementModel = require("../models/departementModel");

//  GET - Tous les enseignants
const getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await Enseignant.find().sort({ dateCreation: -1 });
    res.json(enseignants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//  GET - Un enseignant par ID
const getEnseignantById = async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }
    res.json(enseignant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  POST - Créer un enseignant
const createEnseignant = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      dateNaissance,
      specialite,
      grade,
      departement,
      dateEmbauche,
      statut,
      user,
      coursAffectes,
    } = req.body;

    // 🔹 Récupérer le département par ID
    const dep = await departementModel.findById(departement);
    if (!dep) return res.status(400).json({ message: "Département introuvable" });

    const enseignant = new Enseignant({
      nom,
      prenom,
      email,
      telephone,
      dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
      specialite,
      grade,
      departement: dep._id, // <-- ici le departement comme pour Exam
      dateEmbauche: dateEmbauche ? new Date(dateEmbauche) : undefined,
      statut,
      user,
      coursAffectes,
    });

    const nouvelEnseignant = await enseignant.save();

    res.status(201).json({
      message: "Enseignant créé avec succès",
      enseignant: nouvelEnseignant,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Un enseignant avec cet email existe déjà",
      });
    }
    res.status(400).json({ message: error.message });
  }
};

//  PUT - Modifier un enseignant
const updateEnseignant = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // 🔹 Récupérer le département si fourni
    if (updateData.departement) {
      const dep = await departementModel.findById(updateData.departement);
      if (!dep) return res.status(400).json({ message: "Département introuvable" });
      updateData.departement = dep._id;
    }

    const enseignant = await Enseignant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    res.json({
      message: "Enseignant modifié avec succès",
      enseignant,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//  DELETE - Supprimer un enseignant
const deleteEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.findByIdAndDelete(req.params.id);

    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    res.json({ message: "Enseignant supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentEnseignant = async (req, res) => {
  try {
    const id = req.user.userId;

    const enseignant = await User.findById(id); // <- important
    console.log(enseignant);

    if (!enseignant)
      return res.status(404).json({ message: "Enseignant introuvable" });
    res.json(enseignant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getEmploiDuTemps = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("🔹 userId depuis le token :", userId);

    // 🔸 Trouver l'enseignant lié à ce compte utilisateur
    const enseignant = await Enseignant.findOne({ user: userId });
    if (!enseignant) {
      return res.status(404).json({
        message: "Aucun enseignant lié à ce compte utilisateur.",
      });
    }

    console.log("🔹 Enseignant trouvé :", enseignant._id);

    // 🔸 Vérifier la date
    const dateQuery = req.query.date;
    if (!dateQuery)
      return res.status(400).json({ message: "La date est requise." });

    const startDate = new Date(dateQuery);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateQuery);
    endDate.setHours(23, 59, 59, 999);

    console.log("🔹 Date start :", startDate);
    console.log("🔹 Date end   :", endDate);

    // 🔸 Chercher les cours pour cet enseignant
    const schedules = await scheduleModel
      .find({
        teacher: enseignant._id,
        start: { $gte: startDate, $lte: endDate },
      })
      .populate("teacher", "nom prenom")
      .sort({ start: 1 });

    console.log("🔹 Schedules trouvés :", schedules);
    res.status(200).json(schedules);
  } catch (err) {
    console.error("❌ Erreur getEmploiDuTemps :", err);
    res.status(500).json({ message: err.message });
  }
};


const getCoursAssignes = async (req, res) => {
  try {
    const courses = await scheduleModel
      .find({ teacher: mongoose.Types.ObjectId(req.params.id) })
      .populate("teacher", "nom prenom")
      .distinct("title");
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Export de toutes les méthodes
module.exports = {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
  getCurrentEnseignant,
  getEmploiDuTemps,
  getCoursAssignes,
};
