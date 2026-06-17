const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  address: String,
  rating: Number,
  priceLevel: Number,
  photo: String,
  location: {
    lat: Number,
    lng: Number
  },
  nearestMetroStation: String,
  savedCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experience', experienceSchema);