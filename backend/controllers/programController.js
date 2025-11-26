require('dotenv').config();
const mongoose = require('mongoose');
const formationModel = require("../models/formationModel");
// GET tous les programmes
// const getAllProgram = async (req, res) => {
//   try {
//     const formations = await formationModel.find();
//     const programmes = formations.flatMap(formation => formation.programmes);
//     res.json({ data: programmes});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// GET programme par département et code
// GET tous les programmes
const getAllProgram = async (req, res) => {
  try {
    const formations = await formationModel.find();
    const programmes = formations.flatMap(formation => formation.programmes);
    res.json({ data: programmes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET programme par département et code
const getProgramOfDep = async (req, res) => {
  try {
    const { departement, code } = req.params;

    // Trouver la formation contenant ce programme
    const formation = await formationModel.findOne({
      "programmes.code": code
    });

    if (!formation) {
      return res.status(404).json({ message: "Formation introuvable" });
    }

    // Chercher le programme exact dans la formation
    const programme = formation.programmes.find(p => 
      (p.departement.toString() === departement || p.departement === departement) && 
      p.code === code
    );

    if (!programme) {
      return res.status(404).json({ message: "Programme non trouvé" });
    }

    res.json({ data: programme });

  } catch (error) {
    console.error("Erreur getProgramOfDep :", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};


module.exports = {getAllProgram, getProgramOfDep}