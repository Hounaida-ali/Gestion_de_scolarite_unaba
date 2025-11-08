const express = require('express');
const router = express.Router();
const {
  createEtudiant,
  getEtudiants,
  getEtudiantById,
  updateEtudiant,
  deleteEtudiant,
  validerInscription,
  confirmerPaiement
} = require('../controllers/inscriptionController');

router.post('/', createEtudiant);
router.get('/', getEtudiants);
router.get('/:id', getEtudiantById);
router.put('/:id', updateEtudiant);
router.delete('/:id', deleteEtudiant);
router.patch('/:id/valider', validerInscription);
router.patch('/:id/payer', confirmerPaiement);

module.exports = router;
