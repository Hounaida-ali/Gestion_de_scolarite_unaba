const noteModel = require('../models/noteModel');
const userModel = require('../models/userModel');
const departementModel = require("../models/departementModel");
const formationModel = require("../models/formationModel");

// ➕ Ajouter une note et notifier l’étudiant
const addNote = async (req, res) => {
  try {
    let { etudiant, enseignant, matiere, departement, filiere, niveau, typeEvaluation, note, commentaire } = req.body;

    // 🔍 Trouver l’étudiant et l’enseignant par nom complet
    const [etudiantFirst, etudiantLast] = etudiant.split(' ');
    const [enseignantFirst, enseignantLast] = enseignant.split(' ');

    const etu = await userModel.findOne({
      firstName: etudiantFirst,
      lastName: etudiantLast,
      role: 'student'
    });
    if (!etu) return res.status(404).json({ message: "Étudiant introuvable." });

    const ens = await userModel.findOne({
      firstName: enseignantFirst,
      lastName: enseignantLast,
      role: 'teacher'
    });
    if (!ens) return res.status(404).json({ message: "Enseignant introuvable." });

    // 🔹 Vérifier que le département existe
    const dep = await departementModel.findById(departement);
    if (!dep) return res.status(400).json({ message: "Département introuvable." });

    // 🔹 Vérifier que la filière existe et appartient au département
    const form = await formationModel.findById(filiere);
    if (!form || form.departement.toString() !== dep._id.toString()) {
      return res.status(400).json({ message: "Filière introuvable ou non associée au département." });
    }

    // 🔁 Vérifier si la note existe déjà pour cet étudiant, matière et type
    const existing = await noteModel.findOne({
      etudiant: etu._id,
      matiere,
      typeEvaluation
    });
    if (existing) {
      return res.status(400).json({
        message: "Une note pour cet étudiant, cette matière et ce type d'évaluation existe déjà."
      });
    }

    // ✅ Créer la note
    const newNote = await noteModel.create({
      etudiant: etu._id,
      enseignant: ens._id,
      matiere,
      departement: dep._id,
      filiere: form._id,
      niveau,
      typeEvaluation,
      note,
      commentaire
    });

    res.status(201).json({
      message: "Note ajoutée avec succès.",
      note: {
        _id: newNote._id,
        etudiant: { id: etu._id, nom: `${etu.firstName} ${etu.lastName}` },
        enseignant: { id: ens._id, nom: `${ens.firstName} ${ens.lastName}` },
        matiere,
        departement: dep._id,
        filiere: form._id,
        niveau,
        typeEvaluation,
        note,
        commentaire
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Obtenir toutes les notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await noteModel.find()
      .populate('etudiant', 'firstName lastName')
      .populate('enseignant', 'firstName lastName')
      .populate('departement', 'nom')
      .populate('filiere', 'nom')
      .sort({ dateCreation: -1 });

    const formattedNotes = notes.map(n => ({
      ...n.toObject(),
      etudiant: n.etudiant ? { id: n.etudiant._id, nom: `${n.etudiant.firstName} ${n.etudiant.lastName}` } : null,
      enseignant: n.enseignant ? { id: n.enseignant._id, nom: `${n.enseignant.firstName} ${n.enseignant.lastName}` } : null,
      departement: n.departement ? { id: n.departement._id, nom: n.departement.nom } : null,
      filiere: n.filiere ? { id: n.filiere._id, nom: n.filiere.nom } : null
    }));

    res.json(formattedNotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔎 Obtenir une note par ID
const getNoteById = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id)
      .populate('etudiant', 'firstName lastName')
      .populate('enseignant', 'firstName lastName')
      .populate('departement', 'nom')
      .populate('filiere', 'nom');

    if (!note) return res.status(404).json({ message: 'Note non trouvée.' });

    res.json({
      ...note.toObject(),
      etudiant: note.etudiant ? { id: note.etudiant._id, nom: `${note.etudiant.firstName} ${note.etudiant.lastName}` } : null,
      enseignant: note.enseignant ? { id: note.enseignant._id, nom: `${note.enseignant.firstName} ${note.enseignant.lastName}` } : null,
      departement: note.departement ? { id: note.departement._id, nom: note.departement.nom } : null,
      filiere: note.filiere ? { id: note.filiere._id, nom: note.filiere.nom } : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Mettre à jour une note
const updateNote = async (req, res) => {
  try {
    let { etudiant, enseignant, matiere, departement, filiere, niveau, typeEvaluation, note: noteValue, commentaire } = req.body;

    // 🔹 Transformer noms en ObjectId si fournis
    if (etudiant) {
      const [first, last] = etudiant.split(' ');
      const etu = await userModel.findOne({ firstName: first, lastName: last, role: 'student' });
      if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé.' });
      etudiant = etu._id;
    }
    if (enseignant) {
      const [first, last] = enseignant.split(' ');
      const ens = await userModel.findOne({ firstName: first, lastName: last, role: 'teacher' });
      if (!ens) return res.status(404).json({ message: 'Enseignant non trouvé.' });
      enseignant = ens._id;
    }

    // 🔹 Vérifier département/filière
    if (departement) {
      const dep = await departementModel.findById(departement);
      if (!dep) return res.status(400).json({ message: "Département introuvable." });
    }
    if (filiere) {
      const form = await formationModel.findById(filiere);
      if (!form) return res.status(400).json({ message: "Filière introuvable." });
    }

    const currentNote = await noteModel.findById(req.params.id);
    if (!currentNote) return res.status(404).json({ message: 'Note non trouvée.' });

    const isSame =
      String(currentNote.etudiant) === String(etudiant || currentNote.etudiant) &&
      String(currentNote.enseignant) === String(enseignant || currentNote.enseignant) &&
      currentNote.matiere === (matiere || currentNote.matiere) &&
      currentNote.departement.toString() === (departement?.toString() || currentNote.departement.toString()) &&
      currentNote.filiere.toString() === (filiere?.toString() || currentNote.filiere.toString()) &&
      currentNote.niveau === (niveau || currentNote.niveau) &&
      currentNote.typeEvaluation === (typeEvaluation || currentNote.typeEvaluation) &&
      currentNote.note === (noteValue ?? currentNote.note) &&
      currentNote.commentaire === (commentaire || currentNote.commentaire);

    if (isSame) {
      return res.status(400).json({ success: false, message: "Aucun changement détecté." });
    }

    const updatedNote = await noteModel.findByIdAndUpdate(
      req.params.id,
      { etudiant, enseignant, matiere, departement, filiere, niveau, typeEvaluation, note: noteValue, commentaire },
      { new: true }
    )
      .populate('etudiant', 'firstName lastName')
      .populate('enseignant', 'firstName lastName')
      .populate('departement', 'nom')
      .populate('filiere', 'nom');

    res.json({
      success: true,
      message: 'Note mise à jour avec succès.',
      note: {
        _id: updatedNote._id,
        etudiant: updatedNote.etudiant ? { id: updatedNote.etudiant._id, nom: `${updatedNote.etudiant.firstName} ${updatedNote.etudiant.lastName}` } : null,
        enseignant: updatedNote.enseignant ? { id: updatedNote.enseignant._id, nom: `${updatedNote.enseignant.firstName} ${updatedNote.enseignant.lastName}` } : null,
        departement: updatedNote.departement ? { id: updatedNote.departement._id, nom: updatedNote.departement.nom } : null,
        filiere: updatedNote.filiere ? { id: updatedNote.filiere._id, nom: updatedNote.filiere.nom } : null,
        matiere: updatedNote.matiere,
        niveau: updatedNote.niveau,
        typeEvaluation: updatedNote.typeEvaluation,
        note: updatedNote.note,
        commentaire: updatedNote.commentaire
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Supprimer une note
const deleteNote = async (req, res) => {
  try {
    const note = await noteModel.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée.' });
    res.json({ message: 'Note supprimée avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
};
