const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

async function listTitles() {
  await mongoose.connect(process.env.MONGODB_URI);
  const events = await Event.find({});
  console.log('TITLES_START');
  events.forEach(e => console.log(e.title));
  console.log('TITLES_END');
  await mongoose.disconnect();
}

listTitles();
