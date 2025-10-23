const departementModel = require("../models/departementModel");

// POST nouveau département
const addDepartement = async (req, res) => {
  try {
    const { nom, departement,description } = req.body;
    const newDep = new departementModel({ nom, departement,description });
    const savedDep = await newDep.save();
    res.status(201).json(savedDep);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET tous les départements
const getAllDepartements = async (req, res) => {
  try {
    const departements = await departementModel.find();
    res.json(departements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// supprimer un département par ID
const deleteDepartement = async (req, res) => {
try {
  const { id } = req.params;
  const deletedDep = await departementModel.findByIdAndDelete(id);
  if (!deletedDep) {
    return res.status(404).json({ message: "Département non trouvé" });
  }
  res.json({ message: "Département supprimé avec succès" });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

module.exports = {
  addDepartement,
  getAllDepartements,
  deleteDepartement
};