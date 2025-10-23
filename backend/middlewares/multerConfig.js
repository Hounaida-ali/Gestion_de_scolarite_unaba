const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB max
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip','.odg'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowedTypes.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Type de fichier non autorisé'));  
//     }
//   }
// });

const uploads = multer({ storage: storage });

module.exports = uploads;
