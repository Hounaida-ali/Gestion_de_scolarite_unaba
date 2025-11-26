require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const userRouter = require('./routers/userRouter');
const contactRouter = require('./routers/contactRouter');
const formationRouter = require('./routers/formationRouter');
const programRouter = require('./routers/programRouter');
const departementRouter = require('./routers/departementRouter');
const ressourceRouter = require('./routers/ressourceRouter');
const telechargementRouter = require('./routers/telechargementRouter');
const evenementRouter = require('./routers/evenementRouter');
const academicRouter = require('./routers/academicRouter');
const uploads = require('./middlewares/multerConfig');
const actualiteRoutes = require('./routers/actualiteRouter');
const QuickAccessRouter = require('./routers/QuickAccessRouter');
const dashboardRouter = require('./routers/dashboardRouter');
const seeAllDashboardRouter = require('./routers/seeAllDashboardRouter');
const AllNewsRouter = require('./routers/AllNewsRouter');
const  scheduleRouter = require('./routers/scheduleRouter');
const  examRouter = require('./routers/examRouter');
const  noteRouter = require('./routers/noteRouter');
const inscriptionRouter = require('./routers/inscriptionRouter');
const enseignantRouter = require('./routers/enseignantRouter')
const faculteRouter = require('./routers/faculteRouter')
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
app.use(morgan("dev"));

// Routes
app.use("/api/auth", userRouter);
app.use("/api/contact", contactRouter);
app.use('/api/formations', formationRouter);
app.use('/api/programmes', programRouter);
app.use('/api/departements', departementRouter);
app.use('/api/telechargements', telechargementRouter);
app.use('/api/ressources', ressourceRouter);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Servir les fichiers uploadés
app.use('/api/events', evenementRouter);
app.use('/api/academic-years', academicRouter);
app.use('/api/actualites', actualiteRoutes);
app.use('/api/QuickAccess', QuickAccessRouter);
app.use('/api/Dashboard', dashboardRouter);
app.use('/api/SeeAllDashboard', seeAllDashboardRouter );
app.use('/api/AllNews', AllNewsRouter );
app.use('/api/Schedule', scheduleRouter );
app.use('/api/Exam', examRouter);
app.use('/api/Note', noteRouter);
app.use('/api/etudiants', inscriptionRouter);
app.use('/api/enseignants', enseignantRouter);
app.use('/api/faculte', faculteRouter);

app.post("/api/file-uploads", uploads.single("file"), (req, res) => {
  console.log("File propreties", req.file);
  res.json({
    message: "File uploaded successfully",
    // fileUrl: req.file.path,
    file: {
      nom: req.file.originalname,
      url: req.file.path,
      taille: req.file.size,
      type: req.file.mimetype
    }
  });
});

/// uoloads image etudiant
// uploads images/documents étudiants
app.post("/api/etudiants/file-uploads", uploads.fields([
  { name: 'photoEtudiant', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), (req, res) => {
  try {
    console.log("Photo:", req.files['photoEtudiant']);
    console.log("Documents:", req.files['documents']);
  
    const photoData = req.files['photoEtudiant']?.map(file => ({
      nom: file.originalname,
      url: `/uploads/${file.filename}`,
      taille: file.size,
      type: file.mimetype
    })) || [];
  
    const documentsData = req.files['documents']?.map(file => ({
      nom: file.originalname,
      url: `/uploads/${file.filename}`,
      taille: file.size,
      type: file.mimetype
    })) || [];
  
    res.json({
      message: "Files uploaded successfully",
      photo: photoData[0] || null,
      documents: documentsData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Une error est survenue lors de l'upload.")
  }
});



// Démarrage du serveur
app.listen(PORT, () => console.log(`Server sur le port ${PORT}`));