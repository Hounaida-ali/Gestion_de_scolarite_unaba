const verifyAdmin = (req, res, next) => {
    // req.user doit être rempli par authMiddleware
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : administrateur requis.' });
    }
    next();
};

module.exports = verifyAdmin;
