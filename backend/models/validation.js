const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'string.base': 'Le prénom doit être une chaîne de caractères',
      'string.empty': 'Le prénom est obligatoire',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 30 caractères',
      'any.required': 'Le prénom est obligatoire'
    }),
    
  lastName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'string.base': 'Le nom doit être une chaîne de caractères',
      'string.empty': 'Le nom est obligatoire',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 30 caractères',
      'any.required': 'Le nom est obligatoire'
    }),
    
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'L\'email doit être une chaîne de caractères',
      'string.empty': 'L\'email est obligatoire',
      'string.email': 'Veuillez entrer une adresse email valide',
      'any.required': 'L\'email est obligatoire'
    }),
    
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Le mot de passe doit être une chaîne de caractères',
      'string.empty': 'Le mot de passe est obligatoire',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est obligatoire'
    }),
    
  role: Joi.string()
    .valid("student", "teacher", "admin")
    .required()
    .messages({
      'any.only': 'Le rôle doit être "student", "teacher" ou "admin"',
      'string.empty': 'Le rôle est obligatoire',
      'any.required': 'Le rôle est obligatoire'
    }),
});

module.exports = { userSchema };
