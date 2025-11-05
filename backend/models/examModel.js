const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },          
    description: String,                               
    date: { type: Date, required: true },             
    type: { type: String, enum: ['examen', 'controle'], default: 'examen' }, 
    departement: { type: String, required: true,enum: ['économie', 'droit', 'gestion'] },   // ex: économie, droit, gestion
    filiere: { type: String, required: true, enum: ['science-économie', 'gestion', 'droit', 'économie-monaiteur'] },      // ex: science-économie, finance, marketing
    niveau: { type: String, required: true, enum: ['licence1', 'licence2', 'licence3'] },  // niveau
    room: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },           
    notified: { type: Boolean, default: false }      
});

const ExamModel = mongoose.model('Exam', examSchema);
module.exports = ExamModel;
