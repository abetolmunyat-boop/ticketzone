const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Event = require('./models/Event');

dotenv.config();

async function checkEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const events = await Event.find({});
    console.log(JSON.stringify(events, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkEvents();
