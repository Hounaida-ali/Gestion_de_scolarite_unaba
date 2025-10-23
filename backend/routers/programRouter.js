const express = require('express');
const router = express.Router();

const programController = require('../controllers/programController');

router.get("/", programController.getAllProgram);
router.get("/:departement/:code", programController.getProgramOfDep);

module.exports = router;