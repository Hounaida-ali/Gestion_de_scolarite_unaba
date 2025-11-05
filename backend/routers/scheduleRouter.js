const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/adminMiddleware');
// Importer les méthodes du controller
const {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
} = require('../controllers/scheduleController');


router.get('/', getSchedules);
router.post('/',   createSchedule);
router.put('/:id',   updateSchedule);
router.delete('/:id',  deleteSchedule);

module.exports = router;
