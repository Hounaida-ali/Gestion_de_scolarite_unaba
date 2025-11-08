const noteModel = require('../models/noteModel');
const userModel = require('../models/userModel');

// ➕ Ajouter une note et notifier l’étudiant
const addNote = async (req, res) => {
    try {
        const { etudiant, enseignant, matiere, departement,niveau,filiere, typeEvaluation, note, commentaire } = req.body;

        // 🔍 Trouver l’étudiant et l’enseignant par leurs noms
        const [etudiantFirst, etudiantLast] = etudiant.split(' ');
        const [enseignantFirst, enseignantLast] = enseignant.split(' ');

        const etu = await userModel.findOne({
            firstName: etudiantFirst,
            lastName: etudiantLast,
            role: 'student'
        });

        const ens = await userModel.findOne({
            firstName: enseignantFirst,
            lastName: enseignantLast,
            role: 'teacher'
        });

        if (!etu || !ens) {
            return res.status(404).json({ message: "Étudiant ou enseignant non trouvé." });
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
        const newNote = new noteModel({
            etudiant: etu._id,
            enseignant: ens._id,
            matiere,
            departement,
            niveau,filiere,
            typeEvaluation,
            note,
            commentaire
        });

        await newNote.save();

        // ✅ Réponse avec ID + nom
        res.status(201).json({
            message: "Note ajoutée avec succès.",
            note: {
                _id: newNote._id,
                etudiant: {
                    id: etu._id,
                    nom: `${etu.firstName} ${etu.lastName}`
                },
                enseignant: {
                    id: ens._id,
                    nom: `${ens.firstName} ${ens.lastName}`
                },
                matiere,
                departement,
                typeEvaluation,
                note,
                commentaire
            },
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 📋 Obtenir toutes les notes
const getAllNotes = async (req, res) => {
    try {
        const notes = await noteModel.find()
            .populate('etudiant', 'firstName lastName')
            .populate('enseignant', 'firstName lastName')
            .sort({ dateCreation: -1 });

        // Fusionner firstName + lastName
        const formattedNotes = notes.map(n => ({
            ...n.toObject(),
            etudiant: n.etudiant
                ? { id: n.etudiant._id, nom: `${n.etudiant.firstName} ${n.etudiant.lastName}` }
                : null,
            enseignant: n.enseignant
                ? { id: n.enseignant._id, nom: `${n.enseignant.firstName} ${n.enseignant.lastName}` }
                : null
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
            .populate('enseignant', 'firstName lastName');

        if (!note) return res.status(404).json({ message: 'Note non trouvée.' });

        const formattedNote = {
            ...note.toObject(),
            etudiant: note.etudiant
                ? { id: note.etudiant._id, nom: `${note.etudiant.firstName} ${note.etudiant.lastName}` }
                : null,
            enseignant: note.enseignant
                ? { id: note.enseignant._id, nom: `${note.enseignant.firstName} ${note.enseignant.lastName}` }
                : null
        };

        res.json(formattedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateNote = async (req, res) => {
  try {
    let { etudiant, enseignant, matiere, departement, typeEvaluation, note: noteValue, commentaire } = req.body;

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

    // 🔹 Récupérer la note existante
    const currentNote = await noteModel.findById(req.params.id);
    if (!currentNote) return res.status(404).json({ message: 'Note non trouvée.' });

    // 🔹 Vérifier s'il y a un vrai changement
    const isSame =
      String(currentNote.etudiant) === String(etudiant || currentNote.etudiant) &&
      String(currentNote.enseignant) === String(enseignant || currentNote.enseignant) &&
      currentNote.matiere === (matiere || currentNote.matiere) &&
      currentNote.departement === (departement || currentNote.departement) &&
      currentNote.typeEvaluation === (typeEvaluation || currentNote.typeEvaluation) &&
      currentNote.note === (noteValue ?? currentNote.note) &&
      currentNote.commentaire === (commentaire || currentNote.commentaire);

    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer."
      });
    }

    // 🔹 Mise à jour réelle
    const updatedNote = await noteModel.findByIdAndUpdate(
      req.params.id,
      { etudiant, enseignant, matiere, departement, typeEvaluation, note: noteValue, commentaire },
      { new: true }
    )
      .populate('etudiant', 'firstName lastName')
      .populate('enseignant', 'firstName lastName');

    res.json({
      success: true,
      message: 'Note mise à jour avec succès.',
      note: {
        _id: updatedNote._id,
        etudiant: updatedNote.etudiant
          ? { id: updatedNote.etudiant._id, nom: `${updatedNote.etudiant.firstName} ${updatedNote.etudiant.lastName}` }
          : null,
        enseignant: updatedNote.enseignant
          ? { id: updatedNote.enseignant._id, nom: `${updatedNote.enseignant.firstName} ${updatedNote.enseignant.lastName}` }
          : null,
        matiere: updatedNote.matiere,
        departement: updatedNote.departement,
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
