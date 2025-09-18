const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { v4 } = require("uuid");

const userModel = require("../models/userModel");
const generateOTP = require("../email/generateOTP");
const otpModel = require("../models/otpModel");
const transporter = require("../email/mailTransporter");
const { userSchema } = require("../models/validation");

// Enregistrer un utilisateur
const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const { error } = userSchema.validate({ firstName, lastName, email, password, role });
  if (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status(209).send({ message: "l'email existe déjà" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  let user;
  try {
    user = await userModel.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });
  } catch (error) {
    return res.status(500).send({ message: "L'utilisateur n'a pas pu être ajouté" });
  }

  const otp = generateOTP();
  const otpToken = v4();

  await otpModel.create({
    userId: user._id,
    otp,
    otpToken,
    purpose: "verify-email",
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Vérification email",
    html: `
        <h1>Vérification email</h1>
        <div>
            Utilisez ce code pour vérifier votre email :<br>
            <strong>${otp}</strong>
        </div>
    `,
  });

  res.send({
    message: "Utilisateur ajouté avec succès",
    otpToken,
    user,
  });
};

// Vérification email avec OTP
const verify = async (req, res) => {
  const { otp, otpToken, purpose } = req.body;

  if (purpose !== "verify-email") {
    return res.status(422).send({ message: "purpose invalide" });
  }

  const otpDetails = await otpModel.findOne({ otpToken, purpose });
  if (!otpDetails) {
    return res.status(404).send({ message: "OTP introuvable" });
  }

  if (otp !== otpDetails.otp) {
    return res.status(406).send({ message: "OTP invalide" });
  }

  const verifiedUser = await userModel.findByIdAndUpdate(
    otpDetails.userId,
    { isEmailVerified: true },
    { new: true }
  );

  res.send({
    message: "Utilisateur vérifié avec succès",
    verifiedUser,
  });
};

// Connexion
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "Utilisateur introuvable" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send({ message: "Identifiants invalides" });
  }

  if (!user.isActive) {
    return res.status(401).json({ message: "Ce compte a été désactivé" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.SECRET_KEY,
  );

  res.send({
    message: "Connexion réussie",
    token,
  });
};

// Déconnexion
const logout = async (req, res) => {
  res.send({
    message: "Déconnexion réussie",
  });
};

// Réinitialisation du mot de passe (envoi OTP)
const reinisilize = async (req, res) => {
  const { email } = req.body;

  const existEmail = await userModel.findOne({ email });
  if (!existEmail) {
    return res.status(404).send({ message: "Utilisateur introuvable" });
  }

  const otp = generateOTP();
  const otpToken = v4();

  await otpModel.create({
    userId: existEmail._id,
    otp,
    otpToken,
    purpose: "reset-password",
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: existEmail.email,
    subject: "Réinitialisation du mot de passe",
    html: `
      <h1>Réinitialisation du mot de passe</h1>
      <div>
      Votre code de vérification est :
      <strong>${otp}</strong>
      </div>
    `,
  });

  res.send({
    message: "OTP envoyé avec succès",
    otpToken,
  });
};

// Reset password
const resetPassword = async (req, res) => {
  const { otp, otpToken, purpose, newPassword } = req.body;

  if (purpose !== "reset-password") {
    return res.status(422).send({ message: "Purpose invalide" });
  }

  const otpConcred = await otpModel.findOne({ otpToken, purpose });
  if (!otpConcred) {
    return res.status(404).send({ message: "OTP introuvable" });
  }

  if (otp !== otpConcred.otp) {
    return res.status(406).send({ message: "OTP invalide" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await userModel.findByIdAndUpdate(
    otpConcred.userId,
    { password: hashedPassword },
    { new: true }
  );

  await otpModel.deleteMany({ userId: otpConcred.userId, purpose });

  res.send({
    message: "Mot de passe réinitialisé avec succès",
    updatedUser,
  });
};

const getAll = async (req, res) => {
    const users = await userModel.find()
    res.send(users);
};

module.exports = { register, login, verify, resetPassword, reinisilize, logout, getAll};