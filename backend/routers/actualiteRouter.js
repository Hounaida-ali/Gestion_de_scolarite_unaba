const express = require('express');
const {getAllActualite, getIdActualite, addActualite, updateActualite, deleteActualite} = require('../controllers/actualiteController');

const router = express.Router();

// Routes pour les actualités
router.get('/', getAllActualite);
router.get('/:id', getIdActualite);
router.post('/', addActualite);
router.put('/:id', updateActualite);
router.delete('/:id', deleteActualite);

module.exports = router;