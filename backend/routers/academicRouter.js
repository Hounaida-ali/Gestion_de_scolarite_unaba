const express = require('express');
const {getAllAcademic} = require('../controllers/academicController')
const router = express.Router();

router.get('/', getAllAcademic);

module.exports = router;
