const mongoose = require('mongoose');

const cropLandSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  area: {
    value: Number,
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square-feet'],
      default: 'acres'
    }
  },
  price: {
    type: Number,
    required: true
  },
  priceUnit: {
    type: String,
    enum: ['per-acre', 'per-hectare', 'per-month', 'per-year'],
    default: 'per-acre'
  },
  suitableCrops: [{
    type: String
  }],
  soilType: {
    type: String,
    default: ''
  },
  waterSource: {
    type: String,
    enum: ['well', 'river', 'canal', 'rain', 'irrigation'],
    default: 'rain'
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'leased', 'sold'],
    default: 'available'
  },
  leasedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  leaseStartDate: {
    type: Date
  },
  leaseEndDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CropLand', cropLandSchema);

