  const mongoose = require('mongoose');
  const bcrypt = require('bcrypt');

  const userSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
  }, {
    timestamps: true
  });

  const userModel = mongoose.model('users', userSchema);

  module.exports = userModel;