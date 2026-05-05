const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  layout: [{
    section: { type: String, required: true },
    rows: [{
      rowName: { type: String, required: true },
      seats: [{
        seatNumber: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        priceMultiplier: { type: Number, default: 1.0 }
      }]
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);
