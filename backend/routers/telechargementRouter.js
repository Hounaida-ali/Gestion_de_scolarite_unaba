const express = require('express');
const { addTelechargement, getHistorique } = require('../controllers/telechargementController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour enregistrer un téléchargement
router.post('/', authMiddleware, addTelechargement);

// Route pour obtenir l'historique des téléchargements de l'utilisateur connecté
router.get('/mon-historique', authMiddleware, getHistorique);


module.exports = router;