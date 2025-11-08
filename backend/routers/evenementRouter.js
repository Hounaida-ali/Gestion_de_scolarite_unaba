const express = require('express');
const {getAllEvent, getIdEvent, addEvent, updateEvent, deleteEvent, getnextevent, getEvAcademic} = require('../controllers/evenementController')
const router = express.Router();

// Routes pour les evenement
router.get('/', getAllEvent);
router.post('/', addEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/year/:academicYear', getEvAcademic);
router.get('/upcoming/next', getnextevent);
router.get('/:id', getIdEvent);

module.exports = router;
