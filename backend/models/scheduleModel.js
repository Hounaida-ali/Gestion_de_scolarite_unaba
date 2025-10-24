const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },       // Nom du cours
    teacher: { type: String, required: true },     // Enseignant
    departement: { type: String, required: true },       // Filière/Niveau
    group: { type: String, enum: ['TD', 'TP', 'CM'], default: 'CM' }, // Groupe
    room: { type: String, required: true },        // Salle
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    notified: { type: Boolean, default: false },   // Notification en cas de changement
    canceled: { type: Boolean, default: false }
});

const scheduleModel = mongoose.model('Schedule', scheduleSchema);
module.exports = scheduleModel;
