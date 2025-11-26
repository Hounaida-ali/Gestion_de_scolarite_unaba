const etudiantModel = require("../models/inscriptionModel");
const transporter = require("../email/mailTransporter");

// Générer un ID provisoire unique
const Counter = require("../models/counterModel"); // modèle de compteur

const synchroniserCounter = async () => {
  const dernierEtudiant = await etudiantModel
    .findOne()
    .sort({ dateInscription: -1 })
    .lean();

  if (dernierEtudiant && dernierEtudiant.idProvisoire) {
    const dernierNumero = parseInt(dernierEtudiant.idProvisoire.slice(-4), 10);
    await Counter.findOneAndUpdate(
      { _id: "etudiantId" },
      { seq: dernierNumero },
      { upsert: true }
    );
  } else {
    // Si aucun étudiant, initialise à 0
    await Counter.findOneAndUpdate(
      { _id: "etudiantId" },
      { seq: 0 },
      { upsert: true }
    );
  }
};

// Générer un ID provisoire unique
const genererIdProvisoire = async () => {
  await synchroniserCounter();

  const prefix = "PROV";
  const annee = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { _id: "etudiantId" },
    { $inc: { seq: 1 } }, // incrémente de 1
    { new: true, upsert: true }
  );

  const numero = counter.seq.toString().padStart(4, "0");
  return `${prefix}${annee}${numero}`;
};

//  Créer un nouvel étudiant
const createEtudiant = async (req, res) => {
  try {
    // Vérifier que l'étudiant a au moins 18 ans
    const dateNaissance = new Date(req.body.dateNaissance);
    const aujourdHui = new Date();

    const age = aujourdHui.getFullYear() - dateNaissance.getFullYear();
    const mois = aujourdHui.getMonth() - dateNaissance.getMonth();
    const jours = aujourdHui.getDate() - dateNaissance.getDate();
    const ageReel = mois < 0 || (mois === 0 && jours < 0) ? age - 1 : age;

    if (ageReel < 18) {
      return res.status(400).json({
        message: "L'étudiant doit avoir au moins 18 ans pour s'inscrire.",
      });
    }

    const idProvisoire = await genererIdProvisoire();

    // Photo
    const photoEtudiant = req.body.photoEtudiant;
    const photo = photoEtudiant
      ? {
          filename: photoEtudiant.split("/").pop(),
          originalName: photoEtudiant.split("/").pop(),
          path: photoEtudiant.replace("http://localhost:5000/", "public/"),
          url: photoEtudiant,
        }
      : null;

    
    console.log("Inscription Controller - req.body.documents : ", req.body.documents);
    // Documents
    const documentsFiles = req.body.documents || [];
    console.log("Inscription Controller - Documents Files : ", documentsFiles);
    
    const documents = documentsFiles.map(file => ({
      filename: file.filename,
      originalName: file.originalName,
      path: file.path,
      url: file.url,
    }));
    console.log("Inscription Controller - Documents : ", documents);

    const etudiant = new etudiantModel({
      ...req.body,
      idProvisoire,
      statut: "en-attente",
      fraisInscription: 55000,
      dateInscription: new Date(),
      photo,
      documents, // <- ajout ici
    });
    console.log("Inscription Controller - Etudiant : ", etudiant);

    await etudiant.save();

    res.status(201).json({
      message: `L'étudiant ${etudiant.prenom} ${etudiant.nom} a été enregistré avec succès.`,
      etudiant: {
        _id: etudiant._id,
        idProvisoire: etudiant.idProvisoire,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        statut: etudiant.statut,
        formation: etudiant.formation,
        dateInscription: etudiant.dateInscription,
        photo: etudiant.photo,
        documents: etudiant.documents, // renvoyer les documents
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const champ = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `Un étudiant avec ce ${champ} existe déjà. Veuillez en choisir un autre.`,
      });
    }
    res.status(400).json({ message: error.message });
  }
};



//  Récupérer tous les étudiants
const getEtudiants = async (req, res) => {
  try {
    const etudiants = await etudiantModel.find().sort({ dateInscription: -1 });
    console.log(etudiants);
    
    res.json(etudiants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Récupérer un étudiant par ID
const getEtudiantById = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Mettre à jour un étudiant
const updateEtudiant = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.json(etudiant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Supprimer un étudiant
const deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.json({
      message: `L'étudiant ${etudiant.prenom} ${etudiant.nom} a été supprimé avec succès.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Valider une inscription
const validerInscription = async (req, res) => {
  try {
    let etudiant = await etudiantModel
      .findByIdAndUpdate(req.params.id, { statut: "valide" }, { new: true })
      .populate("departement") // récupère le nom et toutes les infos
      .populate("formation"); // récupère la formation complète

    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    // 💡 Vérifie les noms de champs EXACTS dans ton modèle !!
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: etudiant.email,
      subject: "Votre préinscription a été validée",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2d6a4f;">Validation Administrative</h2>

          <p style="background:#d4edda;padding:10px;border-radius:5px;color:#155724;">
            Votre préinscription a été <strong>validée</strong>.
          </p>

          <p>Vous pouvez maintenant procéder au paiement des frais d'inscription.</p>

          <h3>Récapitulatif de votre préinscription</h3>

          <p><strong>ID Provisoire :</strong> ${
            etudiant.idProvisoire || "Non disponible"
          }</p>
          <p><strong>Nom complet :</strong> ${
            etudiant.nomComplet || etudiant.prenom + " " + etudiant.nom
          }</p>
          <p><strong>Email :</strong> ${etudiant.email}</p>
          <p><strong>Téléphone :</strong> ${etudiant.telephone}</p>

          <p><strong>Département :</strong> ${
            etudiant.departement?.nom || "Non défini"
          }</p>
          <p><strong>Formation :</strong> ${
            etudiant.formation?.nom || "Non défini"
          }</p>

          <p><strong>Niveau :</strong> ${etudiant.niveau}</p>
           <!-- Bouton Continuer vers le paiement -->
      <div style="margin-top: 20px; text-align: center;">
        <a href="http://localhost:4200/paiement/${etudiant._id}" 
           style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: #fff; 
                  text-decoration: none; border-radius: 5px; font-weight: bold;">
           Continuer vers le paiement
        </a>
      </div>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Étudiant validé + Email envoyé",
      etudiant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//  Confirmer le paiement
const confirmerPaiement = async (req, res) => {
  try {
    const etudiant = await etudiantModel.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    etudiant.statut = "paye";
    etudiant.genererNumeroEtudiant();

    await etudiant.save();
    res.json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isRegistered = async (req, res) => {
  try {
    // récupérer l'id de l'utilisateur
    const userId = req.user.userId;
    const inscriptionExists = await etudiantModel.find({ userId });
    console.log(inscriptionExists);

    if (inscriptionExists) {
      return res.status(200).json(true);
    } else {
      return res.status(403).json(false);
    }
    // res.json(inscriptionExists)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Exporter toutes les méthodes
module.exports = {
  createEtudiant,
  getEtudiants,
  getEtudiantById,
  updateEtudiant,
  deleteEtudiant,
  validerInscription,
  confirmerPaiement,
  isRegistered,
};
