const express = require('express');
const router = express.Router();

// Importation du contrôleur
const {
  getAllNews,
  getNewsById,
  addNews,
  updateNews,
  deleteNews
} = require('../controllers/AllNewsController');

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', addNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

module.exports = router;
