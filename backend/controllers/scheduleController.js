const scheduleModel = require('../models/scheduleModel');

// 🔹 Fonction utilitaire pour vérifier les conflits de salle
const hasConflictSchedule = async (start, end, room, excludeId = null) => {
  const query = {
    room,
    start: { $lt: new Date(end) },
    end: { $gt: new Date(start) },
  };
  if (excludeId) query._id = { $ne: excludeId };
  return await scheduleModel.findOne(query);
};

// Récupérer l'emploi du temps (filtré par département ou enseignant)
const getSchedules = async (req, res) => {
  try {
    const query = {};
    if (req.query.department) query.department = req.query.department;
    if (req.query.teacher) query.teacher = req.query.teacher;

    const schedules = await scheduleModel.find(query).sort({ start: 1 });
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un créneau
const createSchedule = async (req, res) => {
  try {
    const { title, department, group, niveau, filiere, room, start, end } = req.body;

    // Vérifie doublon exact
    const existingSchedule = await scheduleModel.findOne({ title, department, group, start, niveau, filiere, room });
    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: "Ce créneau existe déjà."
      });
    }

    // Vérifie les conflits de salle
    const conflict = await hasConflictSchedule(start, end, room);
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Conflit de salle détecté avec le créneau "${conflict.title}" dans la salle ${room}`
      });
    }

    // Création du créneau
    const schedule = new scheduleModel(req.body);
    const newSchedule = await schedule.save();
    res.status(201).json({
      success: true,
      message: "Créneau ajouté avec succès !",
      schedule: newSchedule
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Modifier un créneau
const updateSchedule = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const { title, department, group, room, start, end, niveau, filiere } = req.body;

    // 🔹 Récupérer le créneau existant
    const currentSchedule = await scheduleModel.findById(scheduleId);
    if (!currentSchedule) {
      return res.status(404).json({ success: false, message: "Créneau introuvable." });
    }

    // 🔹 Vérifier s’il y a un vrai changement
    const isSame =
      currentSchedule.title === title &&
      currentSchedule.department === department &&
      currentSchedule.group === group &&
      currentSchedule.room === room &&
      new Date(currentSchedule.start).getTime() === new Date(start).getTime() &&
      new Date(currentSchedule.end).getTime() === new Date(end).getTime() &&
      currentSchedule.niveau === niveau &&
      currentSchedule.filiere === filiere;

    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer."
      });
    }

    // 🔹 Vérifie les doublons exacts hors document actuel
    const existingSchedule = await scheduleModel.findOne({
      title,
      department,
      group,
      start,
      room,
      niveau,
      filiere,
      _id: { $ne: scheduleId }
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: "Un autre créneau identique existe déjà."
      });
    }

    // 🔹 Vérifie les conflits de salle hors document actuel
    const conflict = await hasConflictSchedule(start, end, room, scheduleId);
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Conflit de salle détecté avec le créneau "${conflict.title}" dans la salle ${room}`
      });
    }

    // 🔹 Mise à jour réelle
    const updatedSchedule = await scheduleModel.findByIdAndUpdate(scheduleId, req.body, { new: true });
    return res.json({
      success: true,
      message: "Créneau mis à jour avec succès !",
      schedule: updatedSchedule
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// Supprimer un créneau
const deleteSchedule = async (req, res) => {
  try {
    await scheduleModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Créneau supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
