const express = require('express');
const router = express.Router();
const departementController = require('../controllers/departementController');

router.get("/", departementController.getAllDepartements);
router.post("/", departementController.addDepartement);
router.delete("/:id", departementController.deleteDepartement);

module.exports = router;
