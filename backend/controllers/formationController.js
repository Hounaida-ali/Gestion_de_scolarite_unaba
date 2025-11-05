require('dotenv').config();
const formationModel = require("../models/formationModel");
const departementModel = require("../models/departementModel");
// GET toutes les formations
const getAllFormations = async (req, res) => {
  try {
    const formations = await formationModel.find().populate('departement');
    res.json({ data: formations});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET formation par ID
const getIdFormation = async (req, res) => {
  try {
    const formation = await formationModel.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST nouvelle formation
const addFormation = async (req, res) => {
  try {
    const { nom, duree, departementId, programmes } = req.body;

    // 1️⃣ Vérifier que le département existe
    const departement = await departementModel.findById(departementId);
    if (!departement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Département non trouvé' 
      });
    }

    // 2️⃣ Vérifier qu’un programme avec le même code n’existe pas déjà dans ce département
const codeProgramme = programmes && programmes.length > 0 ? programmes[0].code : null;

if (codeProgramme) {
  const formationExistante = await formationModel.findOne({
    departement: departementId,
    "programmes.code": codeProgramme
  });

  if (formationExistante) {
    return res.status(400).json({
      success: false,
      message: "Un programme avec ce code existe déjà dans ce département."
    });
  }
}

    // 3️⃣ Créer la nouvelle formation
    const nouvelleFormation = new formationModel({
      nom,
      duree,
      departement: departementId,
      programmes: programmes || []
    });

    // 4️⃣ Sauvegarder et peupler le département
    await nouvelleFormation.save();
    await nouvelleFormation.populate('departement', 'nom code');

    // 5️⃣ Réponse
    res.status(201).json({
      success: true,
      data: nouvelleFormation,
      message: "Formation ajoutée avec succès au département"
    });

  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message
    });
  }
};
// GET formations par département
const getFormationsByDepartement = async (req, res) => {
  try {
    const formations = await formationModel.find({ departement: req.params.departementId });
    res.json({ data: formations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT modifier une formation
const updateFormation = async (req, res) => {
  try {
    const formationId = req.params.id;
    const { nom, description, duree, departementId } = req.body;

    // 🔹 Vérifier si la formation existe
    const currentFormation = await formationModel.findById(formationId);
    if (!currentFormation) {
      return res.status(404).json({
        success: false,
        message: "Formation non trouvée.",
      });
    }

    // 🔹 Vérifier s’il y a un vrai changement
    const isSame =
      currentFormation.nom === nom &&
      currentFormation.description === description &&
      currentFormation.duree === duree &&
      currentFormation.departement?.toString() === departementId;

    if (isSame) {
      return res.status(400).json({
        success: false,
        message:
          "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer.",
      });
    }

    // 🔹 Préparer les données de mise à jour
    const updateData = {};
    if (nom) updateData.nom = nom;
    if (description) updateData.description = description;
    if (duree) updateData.duree = duree;
    if (departementId) updateData.departement = departementId;

    // 🔹 Mettre à jour la formation
    const updatedFormation = await formationModel.findByIdAndUpdate(
      formationId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Formation mise à jour avec succès !",
      formation: updatedFormation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// DELETE supprimer une formation
const deleteFormation = async (req, res) => {
  try {
    const formation = await formationModel.findByIdAndDelete(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    res.json({ message: 'Formation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getAllFormations, getIdFormation, addFormation,getFormationsByDepartement, updateFormation, deleteFormation}