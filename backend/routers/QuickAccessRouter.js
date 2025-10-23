const express = require('express');
const {getAllQuickAccess, getIdQuickAccess, addQuickAccess, updateQuickAccess, deleteQuickAccess} = require('../controllers/QuickAccessController');

const router = express.Router();

// Routes pour les actualités
router.get('/', getAllQuickAccess);
router.get('/:id', getIdQuickAccess);
router.post('/', addQuickAccess);
router.put('/:id', updateQuickAccess);
router.delete('/:id', deleteQuickAccess);

module.exports = router;