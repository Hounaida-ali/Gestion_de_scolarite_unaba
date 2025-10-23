const express = require('express');
const router = express.Router();
const {
  getAllSeeAllDashboard,
  getIdSeeAllDashboard,
  addSeeAllDashboard,
  updateSeeAllDashboard,
  deleteSeeAllDashboard
} = require('../controllers/seeAllDashboardControllers');


router.get('/', getAllSeeAllDashboard);
router.get('/:id', getIdSeeAllDashboard);
router.post('/', addSeeAllDashboard);
router.put('/:id', updateSeeAllDashboard);
router.delete('/:id', deleteSeeAllDashboard);

module.exports = router;
