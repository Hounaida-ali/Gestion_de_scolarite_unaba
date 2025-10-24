const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const verifyAdmin = require('../middlewares/adminMiddleware');

const { getAllExams,
    createExam,
    updateExam,
    deleteExam } = require('../controllers/examController');

// Routes
router.get('/', getAllExams);
router.post('/', authMiddleware, verifyAdmin, createExam);
router.put('/:id', authMiddleware, verifyAdmin, updateExam);
router.delete('/:id', authMiddleware, verifyAdmin, deleteExam);

module.exports = router;
