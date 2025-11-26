const departementModel = require("../models/departementModel");
const formationModel = require("../models/formationModel");
const scheduleModel = require("../models/scheduleModel");
const ExamModel = require("../models/examModel");
const Enseignant = require("../models/enseignantModel");

// Récupérer tous les créneaux triés par date
const getAllSchedules = async (req, res) => {
  try {
    const query = {};
    if (req.query.departement) query.departement = req.query.departement;
    if (req.query.teacher) query.teacher = req.query.teacher;
    if (req.query.room) query.room = req.query.room;

    const events = await scheduleModel
      .find(query)
      .populate("teacher", "nom prenom")
      .sort({ start: 1 });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Vérification de conflit entre schedules
const hasConflictSchedule = async (start, end, room, excludeId = null) => {
  const query = {
    room,
    start: { $lt: new Date(end) },
    end: { $gt: new Date(start) }
  };

  if (excludeId) query._id = { $ne: excludeId };
  return await scheduleModel.findOne(query);
};

// Ajouter un créneau
const createSchedule = async (req, res) => {
  try {
    console.log(req.body);

    let {
      title,
      departement,
      filiere,
      niveau,
      teacher,
      group,
      room,
      start,
      end
    } = req.body;

    // Vérifier département
    const dep = await departementModel.findById(departement);
    if (!dep)
      return res.status(400).json({ success: false, message: "Département introuvable" });

    // Vérifier filière
    const formation = await formationModel.findById(filiere);
    if (!formation)
      return res.status(400).json({ success: false, message: "Filière introuvable" });

    // Vérifier enseignant (nom -> ObjectId)
    const enseignant = await Enseignant.findOne({ nom: teacher });
    if (!enseignant)
      return res.status(404).json({ success: false, message: "Enseignant introuvable" });

    // Vérifier doublon exact
    const existing = await scheduleModel.findOne({
      title,
      departement: dep._id,
      filiere: formation._id,
      niveau,
      group,
      room,
      start
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ce créneau existe déjà pour ce département/filière/niveau et cette salle."
      });
    }

    // Vérifier conflits avec un autre schedule
    const conflictSchedule = await hasConflictSchedule(start, end, room);
    if (conflictSchedule) {
      return res.status(400).json({
        success: false,
        message: `Conflit détecté avec "${conflictSchedule.title}" dans la salle ${room}`
      });
    }

    // Vérifier conflit avec examen
    const conflictExam = await ExamModel.findOne({
      room,
      start: { $lt: new Date(end) },
      end: { $gt: new Date(start) }
    });

    if (conflictExam) {
      return res.status(400).json({
        success: false,
        message: `Conflit détecté avec l'examen "${conflictExam.title}" dans la salle ${room}`
      });
    }

    // Préparer l’objet à enregistrer
    const schedule = {
      title,
      departement: dep._id,
      filiere: formation._id,
      niveau,
      teacher: enseignant._id,
      group,
      room,
      start,
      end
    };

    const newSchedule = await scheduleModel.create(schedule);
    console.log(newSchedule);

    return res.status(201).json({
      success: true,
      message: "Créneau ajouté avec succès !",
      schedule: newSchedule
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Mise à jour d’un créneau
const updateSchedule = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      title,
      departement,
      filiere,
      niveau,
      teacher,
      group,
      room,
      start,
      end
    } = req.body;

    const current = await scheduleModel.findById(id);
    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Créneau introuvable."
      });
    }

    // Convertir pour comparer
    const depId = departement.toString();
    const filiereId = filiere.toString();
    const startDate = new Date(start);
    const endDate = new Date(end);

    const enseignant = await Enseignant.findOne({ nom: teacher });
    if (!enseignant)
      return res.status(404).json({ success: false, message: "Enseignant introuvable" });

    // Vérifier s’il y a un vrai changement
    const isSame =
      current.title === title &&
      current.departement.toString() === depId &&
      current.filiere.toString() === filiereId &&
      current.niveau === niveau &&
      current.group === group &&
      current.teacher.toString() === enseignant._id.toString() &&
      current.room === room &&
      new Date(current.start).getTime() === startDate.getTime() &&
      new Date(current.end).getTime() === endDate.getTime();

    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "Aucun changement détecté. Veuillez modifier un champ."
      });
    }

    // Vérifier doublon (hors lui-même)
    const existing = await scheduleModel.findOne({
      title,
      departement,
      filiere,
      niveau,
      group,
      room,
      start,
      _id: { $ne: id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Un autre créneau identique existe déjà."
      });
    }

    // Vérifier conflits
    const conflictSchedule = await hasConflictSchedule(start, end, room, id);
    if (conflictSchedule) {
      return res.status(400).json({
        success: false,
        message: `Conflit détecté avec "${conflictSchedule.title}" dans la salle ${room}`
      });
    }

    const conflictExam = await ExamModel.findOne({
      room,
      start: { $lt: new Date(end) },
      end: { $gt: new Date(start) }
    });

    if (conflictExam) {
      return res.status(400).json({
        success: false,
        message: `Conflit détecté avec l'examen "${conflictExam.title}" dans la salle ${room}`
      });
    }

    // Mise à jour
    const updated = await scheduleModel.findByIdAndUpdate(
      id,
      {
        title,
        departement,
        filiere,
        niveau,
        teacher: enseignant._id,
        group,
        room,
        start,
        end
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Créneau mis à jour avec succès !",
      schedule: updated
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Supprimer un créneau
const deleteSchedule = async (req, res) => {
  try {
    await scheduleModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Créneau supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
