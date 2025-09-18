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
   isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// // Student-specific fields
// const studentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   studentId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   program: {
//     type: String,
//     required: true
//   },
//   level: {
//     type: String,
//     enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
//     required: true
//   },
//   academicYear: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['active', 'graduated', 'suspended', 'expelled'],
//     default: 'active'
//   },
//   enrollmentDate: {
//     type: Date,
//     default: Date.now
//   },
//   guardian: {
//     name: String,
//     phone: String,
//     email: String,
//     relationship: String
//   }
// });

// // Teacher
// const teacherSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   employeeId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   department: {
//     type: String,
//     required: true
//   },
//   specialization: {
//     type: String,
//     required: true
//   },
//   qualification: {
//     type: String,
//     required: true
//   },
//   hireDate: {
//     type: Date,
//     required: true
//   },
//   subjects: [{ 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject'
//   }]
// });

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;