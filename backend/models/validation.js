const Joi = require("joi");

// Schema de validation pour l'inscription et la connexion des utilisateurs
const userSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("student", "teacher", "admin").required()
});

module.exports = { userSchema };
