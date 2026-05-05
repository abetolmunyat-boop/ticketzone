const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const events = [
  {
    title: "The Eras Tour: Taylor Swift",
    description: "Taylor Swift's career-spanning tour celebrating all of her musical eras.",
    longDescription: "Join Taylor Swift for an unforgettable journey through all of her musical 'eras' in this career-spanning stadium tour.",
    date: new Date("2026-08-15T20:00:00"),
    location: "Inglewood, CA",
    venue: "SoFi Stadium",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000",
    category: "Music",
    basePrice: 199,
    capacity: 70000,
    availableSeats: 500,
    featured: true
  },
  {
    title: "NBA Finals: Game 1",
    description: "The championship series of the National Basketball Association.",
    longDescription: "The NBA Finals is the annual championship series of the National Basketball Association (NBA).",
    date: new Date("2026-06-01T19:00:00"),
    location: "Boston, MA",
    venue: "TD Garden",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1000",
    category: "Sports",
    basePrice: 250,
    capacity: 19000,
    availableSeats: 200,
    featured: true
  },
  {
    title: "Hamilton: The Musical",
    description: "The story of Alexander Hamilton, an immigrant from the West Indies who became George Washington's right-hand man.",
    longDescription: "Hamilton is the story of America then, told by America now.",
    date: new Date("2026-07-10T19:00:00"),
    location: "New York, NY",
    venue: "Richard Rodgers Theatre",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1000",
    category: "Arts",
    basePrice: 149,
    capacity: 1300,
    availableSeats: 50,
    featured: true
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Event.deleteMany({});
  await Event.insertMany(events);
  console.log('Seeded 3 events');
  await mongoose.disconnect();
}

seed();
