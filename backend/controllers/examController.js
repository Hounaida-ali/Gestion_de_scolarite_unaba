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

// Ajouter un examen/événement
const createExam = async (req, res) => {
    try {
        const { title, departement, room, start, end } = req.body;

        // Vérifie les doublons exacts
        const existingExam = await ExamModel.findOne({ title, departement, start, room });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: "Cet examen existe déjà pour ce département et cette salle."
            });
        }

        // Vérifie les conflits de salle avec d'autres examens
        const conflictExam = await ExamModel.findOne({
            room,
            start: { $lt: new Date(end) },
            end: { $gt: new Date(start) }
        });

        if (conflictExam) {
            return res.status(400).json({
                success: false,
                message: `Conflit de salle détecté avec l'examen "${conflictExam.title}" dans la salle ${room}`
            });
        }

        // Vérifie les conflits de salle avec l'emploi du temps
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

        const exam = new ExamModel(req.body);
        const newExam = await exam.save();
        res.status(201).json(newExam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Mettre à jour un examen/événement
const updateExam = async (req, res) => {
    try {
        const { title, departement, room, start, end } = req.body;

        // Vérifie les doublons exacts (hors document actuel)
        const existingExam = await ExamModel.findOne({
            title, departement, start, room,
            _id: { $ne: req.params.id }
        });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: "Un autre examen identique existe déjà pour ce département et cette salle."
            });
        }

        // Vérifie les conflits de salle avec d'autres examens
        const conflictExam = await ExamModel.findOne({
            room,
            start: { $lt: new Date(end) },
            end: { $gt: new Date(start) },
            _id: { $ne: req.params.id }
        });

        if (conflictExam) {
            return res.status(400).json({
                success: false,
                message: `Conflit de salle détecté avec l'examen "${conflictExam.title}" dans la salle ${room}`
            });
        }

        // Vérifie les conflits de salle avec l'emploi du temps
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

        const updatedExam = await ExamModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedExam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Supprimer un examen/événement
const deleteExam = async (req, res) => {
    try {
        await ExamModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supprimé avec succès' });
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
