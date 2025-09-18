require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routers/userRouter');

const app = express();
const PORT = process.env.PORT 

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à la base de données"))
  .catch((err) => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRouter);

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server sur le port ${PORT}`));