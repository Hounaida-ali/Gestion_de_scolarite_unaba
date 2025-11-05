const ExamModel = require('../models/examModel');
const scheduleModel = require('../models/scheduleModel');

// Récupérer tous les examens/événements triés par date
const getAllExams = async (req, res) => {
    try {
        const query = {};
        if (req.query.departement) query.departement = req.query.departement;
        if (req.query.type) query.type = req.query.type;
        if (req.query.room) query.room = req.query.room;

        const events = await ExamModel.find(query).sort({ start: 1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 Fonction utilitaire pour vérifier les conflits
const hasConflict = async (start, end, room, excludeId = null) => {
  const query = {
    room,
    start: { $lt: new Date(end) },
    end: { $gt: new Date(start) }
  };
  if (excludeId) query._id = { $ne: excludeId };
  return await ExamModel.findOne(query);
};


// Ajouter un examen/événement
const createExam = async (req, res) => {
  try {
    const { title, departement, room, start, niveau, filiere, end } = req.body;

    // Vérifie les doublons exacts
    const existingExam = await ExamModel.findOne({ title, departement, start, niveau, filiere, room });
    if (existingExam) {
      return res.status(400).json({ success: false, message: "Cet examen existe déjà pour ce département/filiere/niveau et cette salle." });
    }

    // Vérifie conflit de salle
    const conflictExam = await hasConflict(start, end, room);
    if (conflictExam) {
      return res.status(400).json({
        success: false,
        message: `Conflit de salle détecté avec l'examen "${conflictExam.title}" dans la salle ${room}`
      });
    }

    // Vérifie conflit avec emploi du temps
    const conflictSchedule = await scheduleModel.findOne({
      room,
      start: { $lt: new Date(end) },
      end: { $gt: new Date(start) }
    });

    if (conflictSchedule) {
      return res.status(400).json({
        success: false,
        message: `Conflit de salle détecté avec le créneau "${conflictSchedule.title}" dans la salle ${room}`
      });
    }

    const newExam = await ExamModel.create(req.body);
    return res.status(201).json({ success: true, message: "Examen ajouté avec succès !",exam: newExam });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};



// Mettre à jour un examen/événement
const updateExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const { title, departement, room, start, end, niveau, filiere } = req.body;

    // 🔹 Récupérer l'examen actuel
    const currentExam = await ExamModel.findById(examId);
    if (!currentExam) {
      return res.status(404).json({ success: false, message: "Examen introuvable." });
    }

    // 🔹 Vérifier s’il y a un vrai changement avant de continuer
    const isSame =
      currentExam.title === title &&
      currentExam.departement === departement &&
      currentExam.room === room &&
      new Date(currentExam.start).getTime() === new Date(start).getTime() &&
      new Date(currentExam.end).getTime() === new Date(end).getTime() &&
      currentExam.niveau === niveau &&
      currentExam.filiere === filiere;

    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer."
      });
    }

    // 🔹 Vérifie les doublons
    const existingExam = await ExamModel.findOne({
      title,
      departement,
      start,
      room,
      niveau,
      filiere,
      _id: { $ne: examId }
    });
    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: "Un autre examen identique existe déjà pour ce département et cette salle."
      });
    }

    // 🔹 Vérifie les conflits
    const conflictExam = await hasConflict(start, end, room, examId);
    if (conflictExam) {
      return res.status(400).json({
        success: false,
        message: `Conflit de salle détecté avec l'examen "${conflictExam.title}" dans la salle ${room}`
      });
    }

    const conflictSchedule = await scheduleModel.findOne({
      room,
      start: { $lt: new Date(end) },
      end: { $gt: new Date(start) }
    });

    if (conflictSchedule) {
      return res.status(400).json({
        success: false,
        message: `Conflit avec l'emploi du temps : "${conflictSchedule.title}" dans la salle ${room}`
      });
    }

    // 🔹 Mise à jour uniquement si changement réel
    const updatedExam = await ExamModel.findByIdAndUpdate(examId, req.body, { new: true });
    return res.json({
      success: true,
      message: "Examen mis à jour avec succès !",
      exam: updatedExam
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// Supprimer un examen/événement
const deleteExam = async (req, res) => {
    try {
        await ExamModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Examen supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllExams,
    createExam,
    updateExam,
    deleteExam
};
