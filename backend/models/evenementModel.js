const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['cours', 'examen', 'vacances', 'ferier', 'autre'],
    required: true
  },
  period: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// eventSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });
const eventModel = mongoose.model('Event', eventSchema);

module.exports = eventModel;