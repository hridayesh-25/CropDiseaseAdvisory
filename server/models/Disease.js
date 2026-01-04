const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  diseaseName: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  predictedDisease: {
    type: String,
    default: ''
  },
  confidence: {
    type: Number,
    default: 0
  },
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  specialistNotes: {
    type: String,
    default: ''
  },
  medicines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Disease', diseaseSchema);

