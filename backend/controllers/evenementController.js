require('dotenv').config();
const eventModel = require('../models/evenementModel');

// GET all events
const getAllEvent = async (req, res) => {
  try {
    const { academicYear, type, semester } = req.query;
    let filter = {};

    if (academicYear) filter.academicYear = academicYear;
    if (type) filter.type = type;
    if (semester) filter.semester = parseInt(semester);

    const events = await eventModel.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET event by ID
const getIdEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new event
const addEvent = async (req, res) => {
  try {
    const { title, description, date, type, period, academicYear, semester } = req.body;

    // 🔍 Vérifier les événements en double
    const existingEvent = await eventModel.findOne({
      title,
      description,
      date,
      type,
      period,
      academicYear,
      semester
    });

    if (existingEvent) {
      return res.status(400).json({ success: false, message: "❌ Cet événement existe déjà." });
    }

    // ✅ Créer et sauvegarder le nouvel événement
    const event = new eventModel({ title, description, date, type, period, academicYear, semester });
    const savedEvent = await event.save();

    // ✅ Réponse de succès
    res.status(201).json({
      success: true,
      message: "Événement enregistré avec succès.",
      event: savedEvent
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// UPDATE event
const updateEvent = async (req, res) => {
  try {
    const currentEvent = await eventModel.findById(req.params.id);

    if (!currentEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { title, description, date, type, period, academicYear, semester } = req.body;

    // Vérification stricte
    const isSame =
      currentEvent.title === title &&
      currentEvent.description === description &&
      new Date(currentEvent.date).getTime() === new Date(date).getTime() &&
      currentEvent.type === type &&
      currentEvent.period === period &&
      currentEvent.academicYear === academicYear &&
      currentEvent.semester === semester;

    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "Aucun changement détecté. Veuillez modifier au moins un champ avant d’enregistrer."
      });
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(
      req.params.id,
      { title, description, date, type, period, academicYear, semester },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Événement mis à jour avec succès.',
      event: updatedEvent
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// DELETE event
const deleteEvent = async (req, res) => {
  try {
    const event = await eventModel.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: '❌ Événement introuvable.'
      });
    }

    res.status(200).json({
      success: true,
      message: ' Événement supprimé avec succès.',
      deletedEvent: event // (optionnel : utile pour journaliser ou annuler)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET upcoming events
const getnextevent = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = await eventModel.find({
      date: { $gte: today }
    })
      .sort({ date: 1 })
      .limit(5); // Limiter aux 5 prochains événements

    res.json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET events by academic year
const getEvAcademic = async (req, res) => {
  try {
    const events = await eventModel.find({
      academicYear: req.params.academicYear
    }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEvent, getIdEvent, addEvent, updateEvent, deleteEvent, getnextevent, getEvAcademic }