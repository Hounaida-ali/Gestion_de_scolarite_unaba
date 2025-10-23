require('dotenv').config();
const Contact = require("../models/contactModel");
const transporter = require("../email/mailTransporter");
// Route POST pour enregistrer un message
 const saveMessage =  async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Confirmation de réception",
      text: `Bonjour ${req.body.name || req.body.lastName},\n\nMerci pour votre message,\nNous vous répondrons très bientôt.\n\nCordialement,\nService Administratif UNABA`
    });

    res.status(201).json({ message: "Message enregistré et email envoyé !" });
  } catch (err) {
    console.error("Erreur saveMessage:", err);  
    res.status(500).json({ error: err.message }); 
  }
};

// Route GET pour consulter tous les messages
const getAllMessages = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};

const message = async (req, res) => {
  try {
    const { reply } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );
    res.json({ message: "Réponse envoyée avec succès", contact });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'envoi de la réponse" });
  }
};

const deleteMessge = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
module.exports = { saveMessage, getAllMessages,message,deleteMessge};