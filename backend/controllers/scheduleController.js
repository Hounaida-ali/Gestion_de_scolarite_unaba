const scheduleModel = require('../models/scheduleModel');

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
        const { title, department, group, room, start, end } = req.body;

        // Vérifie les doublons exacts
        const existingSchedule = await scheduleModel.findOne({ title, department, group, start, room });
        if (existingSchedule) {
            return res.status(400).json({
                success: false,
                message: "Ce créneau existe déjà."
            });
        }

        // Vérifie les conflits de salle
        const conflict = await scheduleModel.findOne({
            room,
            start: { $lt: new Date(end) },
            end: { $gt: new Date(start) }
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: `Conflit de salle détecté avec le créneau "${conflict.title}" dans la salle ${room}`
            });
        }

        const schedule = new scheduleModel(req.body);
        const newSchedule = await schedule.save();
        res.status(201).json(newSchedule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Modifier un créneau
const updateSchedule = async (req, res) => {
    try {
        const { title, department, group, room, start, end } = req.body;

        // Vérifie les doublons exacts (hors document actuel)
        const existingSchedule = await scheduleModel.findOne({
            title, department, group, start, room,
            _id: { $ne: req.params.id }
        });
        if (existingSchedule) {
            return res.status(400).json({
                success: false,
                message: "Un autre créneau identique existe déjà."
            });
        }

        // Vérifie les conflits de salle (hors document actuel)
        const conflict = await scheduleModel.findOne({
            room,
            start: { $lt: new Date(end) },
            end: { $gt: new Date(start) },
            _id: { $ne: req.params.id }
        });
        if (conflict) {
            return res.status(400).json({
                success: false,
                message: `Conflit de salle détecté avec le créneau "${conflict.title}" dans la salle ${room}`
            });
        }

        const updatedSchedule = await scheduleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSchedule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Supprimer un créneau
const deleteSchedule = async (req, res) => {
    try {
        await scheduleModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Creneau supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
};
