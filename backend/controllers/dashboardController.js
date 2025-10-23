require('dotenv').config();
const DashboardModel = require('../models/dashboardModel');

// GET tous les dashboards
const getAllDashboard = async (req, res) => {
  try {
    const dashboards = await DashboardModel.find()
      .sort({ createdAt: -1 }); 

    res.json({
      success: true,
      data: dashboards,
      count: dashboards.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des dashboards',
      error: error.message
    });
  }
};

// GET un dashboard par ID
const getIdDashboard = async (req, res) => {
  try {
    const dashboard = await DashboardModel.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard non trouvé'
      });
    }

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du dashboard',
      error: error.message
    });
  }
};

// POST créer un nouveau dashboard
const addDashboard = async (req, res) => {
  try {
    const { titre, contenu, label, labelIcon, icon, actionText } = req.body;

    // Validation simple
    if (!titre || !contenu || !label || !icon || !actionText) {
      return res.status(400).json({
        success: false,
        message: 'Les champs titre, contenu, label et icon sont obligatoires'
      });
    }

    const existingDashboard = await DashboardModel.findOne({ titre: titre.trim() });
    if (existingDashboard) {
      return res.status(400).json({
        success: false,
        message: "Un dashboard avec ce titre existe déjà"
      });
    }

    const nouveauDashboard = new DashboardModel({
      titre,
      contenu,
      label,
      labelIcon,
      icon,
      actionText
    });

    await nouveauDashboard.save();

    res.status(201).json({
      success: true,
      message: 'Dashboard créé avec succès',
      data: nouveauDashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du dashboard',
      error: error.message
    });
  }
};

// PUT modifier un dashboard
const updateDashboard = async (req, res) => {
  try {
    const { titre, contenu, label, icon,labelIcon, actionText } = req.body;

    const dashboard = await DashboardModel.findByIdAndUpdate(
      req.params.id,
      { titre, contenu, label, labelIcon, icon, actionText },
      { new: true }
    );

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Dashboard modifié avec succès',
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du dashboard',
      error: error.message
    });
  }
};

// DELETE supprimer un dashboard
const deleteDashboard = async (req, res) => {
  try {
    const dashboard = await DashboardModel.findByIdAndDelete(req.params.id);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Dashboard supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getAllDashboard,
  getIdDashboard,
  addDashboard,
  updateDashboard,
  deleteDashboard
};
