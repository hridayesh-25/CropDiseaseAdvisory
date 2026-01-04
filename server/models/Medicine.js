const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  disease: {
    type: String,
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  priceCategory: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  effectiveness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medicine', medicineSchema);

