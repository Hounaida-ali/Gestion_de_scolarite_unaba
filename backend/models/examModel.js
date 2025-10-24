const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },          
    description: String,                               
    date: { type: Date, required: true },             
    type: { type: String, enum: ['examen', 'événement'], default: 'examen' }, 
    departement: { type: String, required: true },    
    room: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },           
    notified: { type: Boolean, default: false }      
});

const ExamModel = mongoose.model('Exam', examSchema);
module.exports = ExamModel;
