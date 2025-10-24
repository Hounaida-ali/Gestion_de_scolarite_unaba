const express = require('express');
const {getAllDashboards,
  getDashboardById,
  addDashboard,
  updateDashboard,
  deleteDashboard,} = require('../controllers/dashboardController');

const router = express.Router();

// Routes pour les actualités
router.get('/', getAllDashboards);
router.get('/:id', getDashboardById);
router.post('/', addDashboard);
router.put('/:id', updateDashboard);
router.delete('/:id', deleteDashboard);

module.exports = router;