require('dotenv').config();
const eventModel = require('../models/evenementModel');

// GET all academic years
const getAllAcademic = async (req, res) => {
  try {
    const academicYears = await eventModel.distinct('academicYear');
    res.json(academicYears.sort().reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getAllAcademic};