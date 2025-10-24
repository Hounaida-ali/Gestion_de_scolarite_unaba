const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/adminMiddleware');
const verifyAdmin = require('../middlewares/adminMiddleware');
// Importer les méthodes du controller
const {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
} = require('../controllers/scheduleController');


router.get('/', getSchedules);
router.post('/', authMiddleware, verifyAdmin, createSchedule);
router.put('/:id', authMiddleware, verifyAdmin, updateSchedule);
router.delete('/:id', authMiddleware, verifyAdmin,deleteSchedule);

module.exports = router;
