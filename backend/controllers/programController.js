require('dotenv').config();
const formationModel = require("../models/formationModel");
// GET tous les programmes
const getAllProgram = async (req, res) => {
  try {
    const formations = await formationModel.find();
    const programmes = formations.flatMap(formation => formation.programmes);
    res.json({ data: programmes});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET programme par département et code
const getProgramOfDep = async (req, res) => {
  try {
    const formation = await formationModel.findOne({
      'programmes.departement': req.params.departement,
      'programmes.code': req.params.code
    });
    
    if (!formation) {
      return res.status(404).json({ message: 'Programme non trouvé' });
    }
    
    const programme = formation.programmes.find(
      p => p.departement === req.params.departement && p.code === req.params.code
    );
    
    res.json({data: programme});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getAllProgram, getProgramOfDep}