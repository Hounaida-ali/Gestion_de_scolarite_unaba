const express = require('express');
const router = express.Router();

const formationController = require('../controllers/formationController');

router.get("/", formationController.getAllFormations);
router.get("/:id", formationController.getIdFormation);
router.post("/",  formationController.addFormation);
router.get("/departement/:departementId", formationController.getFormationsByDepartement);
router.put("/:id", formationController.updateFormation);
router.delete("/:id", formationController.deleteFormation);

module.exports = router;