const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Aucun token fourni." });
  }

  const [type, token] = authHeader.split(" ");

  if (type.toLowerCase() !== "bearer") {
    return res.status(401).json({ message: "Type d'authentification invalide." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("JWT décodé :", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur JWT :", error.message);
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
