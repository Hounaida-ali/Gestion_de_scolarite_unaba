const express = require('express');
const router = express.Router();
const faculteController = require('../controllers/faculteController');

router.post('/', faculteController.createFaculte);
router.get('/', faculteController.getAllFacultes);
router.get('/:id', faculteController.getFaculteById);
router.put('/:id', faculteController.updateFaculte);
router.delete('/:id', faculteController.deleteFaculte);

module.exports = router;
