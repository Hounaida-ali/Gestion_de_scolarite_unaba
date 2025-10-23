    require('dotenv').config();
const Ressource = require('../models/ressourceModel');

// GET toutes les ressources avec filtres
const getAllRessource = async (req, res) => {
  try {
    const { type, niveau, matiere, search, page = 1, limit = 10 } = req.query;

    let query = { estPublic: true };

    // Filtres
    if (type) query.type = type;
    if (niveau) query.niveau = niveau;
    if (matiere) query.matiere = matiere;

    // Recherche textuelle
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { datePublication: -1 },
      populate: 'auteur'
    };

    const ressources = await Ressource.find(query)
      .populate('auteur', 'firstName lastName')
      .sort({ datePublication: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ressource.countDocuments(query);

    res.json({
      ressources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ressource par ID
const getIdRessource = async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id)
      .populate('auteur', 'firstName lastName');

    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    res.json(ressource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST nouvelle ressource (authentification requise)
const addRessource = async (req, res) => {
  try {

    const { titre, description, type, niveau, matiere, tags, fichier } = req.body;
     const existing = await Ressource.findOne({ titre, matiere, niveau });
    if (existing) {
      return res.status(400).json({ message: 'Une ressource identique existe déjà.' });
    }
    const ressource = new Ressource({
      titre,
      description,
      type,
      niveau,
      matiere,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fichier,
      auteur: req.user.userId
    });
    await ressource.save();
    await ressource.populate('auteur', 'firstName lastName');

    res.status(201).json({
      message: 'Ressource créée avec succès',
      ressource
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRessource = async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id);

    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    // Vérifier que l'utilisateur est l'auteur ou un admin
    if (ressource.auteur.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const {
      titre,
      description,
      type,
      niveau,
      matiere,
      tags,
    } = req.body;

    // Préparer les données à mettre à jour
    const updateData = {};

    if (titre) updateData.titre = titre;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    if (niveau) updateData.niveau = niveau;
    if (matiere) updateData.matiere = matiere;
    if (tags) {
      updateData.tags = Array.isArray(tags)
        ? tags.map(tag => tag.trim())
        : tags.split(',').map(tag => tag.trim());
    }   
     // Mise à jour dans la base
    const updatedRessource = await Ressource.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // renvoie le document mis à jour
    ).populate('auteur', 'firstName lastName');

    res.json({
      message: 'Ressource mise à jour avec succès',
      ressource: updatedRessource
    });
  } catch (error) {
    console.error('Erreur updateRessource:', error);
    res.status(400).json({ message: error.message });
  }
};


// DELETE supprimer une ressource
const deleteRessource = async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id);

    if (!ressource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    // Vérifier que l'utilisateur est l'auteur ou un admin
    if (ressource.auteur.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    await Ressource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ressource supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllRessource, getIdRessource, addRessource, updateRessource, deleteRessource };
