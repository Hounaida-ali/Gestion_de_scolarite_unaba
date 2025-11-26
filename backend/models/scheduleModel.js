const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant', required: true },
    departement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Departement",
        required: true,
      },
      filiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Formation",
        required: true,
      }, // ex: science-économie, finance, marketing
      niveau: {
        type: String,
        required: true,
      }, // niveau
    group: { type: String, enum: ['TD', 'TP', 'CM', 'contrôle'], default: 'CM' },
    room: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    notified: { type: Boolean, default: false },
    canceled: { type: Boolean, default: false }
});

const scheduleModel = mongoose.model('Schedule', scheduleSchema);
module.exports = scheduleModel;
