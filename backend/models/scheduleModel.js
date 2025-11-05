const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    teacher: { type: String, required: true },
    departement: { type: String, required: true,enum: ['économie', 'droit', 'gestion'] },   // ex: économie, droit, gestion
    filiere: { type: String, required: true, enum: ['science-économie', 'gestion', 'droit', 'économie-monaiteur'] },      // ex: science-économie, finance, marketing
    niveau: { type: String, required: true, enum: ['licence1', 'licence2', 'licence3'] },  // niveau
    group: { type: String, enum: ['TD', 'TP', 'CM'], default: 'CM' },
    room: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    notified: { type: Boolean, default: false },
    canceled: { type: Boolean, default: false }
});

const scheduleModel = mongoose.model('Schedule', scheduleSchema);
module.exports = scheduleModel;
