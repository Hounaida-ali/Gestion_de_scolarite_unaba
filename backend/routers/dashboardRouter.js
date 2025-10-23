const express = require('express');
const {getAllDashboard, getIdDashboard, addDashboard, updateDashboard, deleteDashboard} = require('../controllers/dashboardController');

const router = express.Router();

// Routes pour les actualités
router.get('/', getAllDashboard);
router.get('/:id', getIdDashboard);
router.post('/', addDashboard);
router.put('/:id', updateDashboard);
router.delete('/:id', deleteDashboard);

module.exports = router;