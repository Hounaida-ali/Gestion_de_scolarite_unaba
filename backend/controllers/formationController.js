require("dotenv").config();
const formationModel = require("../models/formationModel");
const departementModel = require("../models/departementModel");

/* =====================================================
   🔹 GET — Toutes les formations
===================================================== */
const getAllFormations = async (req, res) => {
  console.log("\nGet All Foramations Called.\n");
  
  try {
    const formations = await formationModel
      .find()
      .populate("departement", "nom departement");

    res.json({ success: true, len: formations.length, data: formations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   🔹 GET — Formation par ID
===================================================== */
const getIdFormation = async (req, res) => {
  try {
    const formation = await formationModel
      .findById(req.params.id)
      .populate("departement", "nom departement");

    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    res.json({ success: true, data: formation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   🔹 POST — Ajouter une formation
===================================================== */
const addFormation = async (req, res) => {
  try {
    const { nom, departementId, programmes } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !departementId) {
      return res.status(400).json({
        success: false,
        message: "Le nom et le département sont obligatoires.",
      });
    }

    // Vérifier département
    const departement = await departementModel.findById(departementId);
    if (!departement) {
      return res.status(404).json({
        success: false,
        message: "Département non trouvé.",
      });
    }
    //  Vérifier si une formation portant le même nom existe dans le même département
    const existingFormation = await formationModel.findOne({
      nom: nom.trim(),
      departement: departementId,
    });

    if (existingFormation) {
      return res.status(400).json({
        success: false,
        message: `La formation '${nom}' existe déjà dans ce département.`,
      });
    }
    // Vérifier code programme unique
    if (programmes && programmes.length > 0) {
      for (let prog of programmes) {
        const exist = await formationModel.findOne({
          departement: departementId,
          "programmes.code": prog.code,
        });

        if (exist) {
          return res.status(400).json({
            success: false,
            message: `Un programme avec le code '${prog.code}' existe déjà dans ce département.`,
          });
        }
      }
    }

    // Création de la formation
    const newFormation = new formationModel({
      nom,
      departement: departementId,
      programmes: programmes || [],
    });

    await newFormation.save();
    await newFormation.populate("departement", "nom departement");

    res.status(201).json({
      success: true,
      message: "Formation ajoutée avec succès.",
      data: newFormation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   🔹 GET — Formations par département
===================================================== */
const getFormationsByDepartement = async (req, res) => {
  try {
    const formations = await formationModel
      .find({ departement: req.params.departementId })
      .populate("departement", "nom departement");

    res.json({ success: true, data: formations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   🔹 PUT — Modifier formation
===================================================== */
const updateFormation = async (req, res) => {
  try {
    const formationId = req.params.id;
    const { nom, departementId, programmes } = req.body;

    const formation = await formationModel.findById(formationId);
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: "Formation non trouvée.",
      });
    }

    // Si changement de département → vérifier existence
    if (departementId) {
      const dep = await departementModel.findById(departementId);
      if (!dep) {
        return res.status(404).json({
          success: false,
          message: "Département inexistant.",
        });
      }
    }

    // Mise à jour
    if (nom) formation.nom = nom;
    if (departementId) formation.departement = departementId;
    if (programmes) formation.programmes = programmes;

    await formation.save();
    await formation.populate("departement", "nom departement");

    res.json({
      success: true,
      message: "Formation mise à jour avec succès",
      data: formation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   🔹 DELETE — Supprimer formation
===================================================== */
const deleteFormation = async (req, res) => {
  try {
    const formation = await formationModel.findByIdAndDelete(req.params.id);

    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    res.json({ success: true, message: "Formation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllFormations,
  getIdFormation,
  addFormation,
  getFormationsByDepartement,
  updateFormation,
  deleteFormation,
};
