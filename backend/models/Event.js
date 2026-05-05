const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, enum: ['Music', 'Sports', 'Arts', 'Family'], required: true },
  basePrice: { type: Number, required: true },
  capacity: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  longDescription: { type: String },
  seatingData: { type: mongoose.Schema.Types.Mixed }, // Dynamic seating layout
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
