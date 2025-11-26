const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const {   
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
  getCurrentEnseignant,
  getEmploiDuTemps,
  getCoursAssignes
} = require('../controllers/enseignantConroller');

// Définition des routes
router.get('/', getAllEnseignants);
router.get('/me', auth, getCurrentEnseignant);
router.get('/:id', getEnseignantById);
router.post('/', createEnseignant);
router.put('/:id', updateEnseignant);
router.delete('/:id', deleteEnseignant);
router.get('/:id/emploi-du-temps', auth, getEmploiDuTemps);
router.get('/:id/cours-assignes', auth, getCoursAssignes);


module.exports = router;
