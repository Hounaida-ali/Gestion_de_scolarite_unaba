const express = require('express');
const {getAllRessource, getIdRessource, addRessource, updateRessource, deleteRessource} = require('../controllers/ressourceController');
const upload = require('../middlewares/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes pour les ressources
router.get('/', getAllRessource);
router.get('/:id', getIdRessource);
router.post('/', authMiddleware, upload.single('fichier'), addRessource);
router.put('/:id', authMiddleware, updateRessource);
router.delete('/:id', authMiddleware, deleteRessource);

module.exports = router;