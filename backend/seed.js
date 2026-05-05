const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phoneNumber: String,
  tickets: []
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  venue: String,
  image: String,
  category: String,
  basePrice: Number,
  capacity: Number,
  availableSeats: Number,
  featured: Boolean
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@1234', 10);
  await User.findOneAndUpdate(
    { email: 'admin@ticketszone.com' },
    { name: 'Admin', email: 'admin@ticketszone.com', password: hashedPassword, role: 'admin' },
    { upsert: true, new: true }
  );
  console.log('✅ Admin user created: admin@ticketszone.com / Admin@1234');

  // Sample events
  const events = [
    {
      title: 'Nairobi Jazz Night',
      description: 'A spectacular jazz evening featuring top Kenyan and international jazz artists at the beautiful KICC grounds.',
      date: new Date('2026-06-15T19:00:00'),
      location: 'Nairobi, Kenya',
      venue: 'KICC Grounds',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      category: 'Music',
      basePrice: 2500,
      capacity: 500,
      availableSeats: 500,
      featured: true
    },
    {
      title: 'AFC Leopards vs Gor Mahia',
      description: 'The biggest rivalry in Kenyan football! Watch the two biggest clubs battle it out in a must-see derby.',
      date: new Date('2026-06-20T15:00:00'),
      location: 'Nairobi, Kenya',
      venue: 'Nyayo National Stadium',
      image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
      category: 'Sports',
      basePrice: 500,
      capacity: 10000,
      availableSeats: 10000,
      featured: true
    },
    {
      title: 'Sauti Sol Live Concert',
      description: 'East Africa\'s biggest band returns to Nairobi for an unforgettable night of music, culture, and entertainment.',
      date: new Date('2026-07-04T18:00:00'),
      location: 'Nairobi, Kenya',
      venue: 'Carnivore Grounds',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      category: 'Music',
      basePrice: 3000,
      capacity: 2000,
      availableSeats: 2000,
      featured: true
    },
    {
      title: 'Nairobi Art Exhibition 2026',
      description: 'Explore Kenya\'s vibrant art scene with over 100 artists showcasing paintings, sculptures, and digital art.',
      date: new Date('2026-06-28T10:00:00'),
      location: 'Nairobi, Kenya',
      venue: 'National Museum of Kenya',
      image: 'https://images.unsplash.com/photo-1545243424-0ce743213a36?w=800',
      category: 'Arts',
      basePrice: 800,
      capacity: 300,
      availableSeats: 300,
      featured: false
    },
    {
      title: 'Kids Fun Carnival',
      description: 'A magical day of rides, games, face painting, and live entertainment for the whole family to enjoy!',
      date: new Date('2026-07-12T09:00:00'),
      location: 'Nairobi, Kenya',
      venue: 'Uhuru Park',
      image: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800',
      category: 'Family',
      basePrice: 300,
      capacity: 1000,
      availableSeats: 1000,
      featured: false
    },
    {
      title: 'Mombasa Beach Music Festival',
      description: 'Dance under the stars on the beautiful Diani Beach with Kenya\'s top DJs and live bands.',
      date: new Date('2026-08-01T16:00:00'),
      location: 'Mombasa, Kenya',
      venue: 'Diani Beach',
      image: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800',
      category: 'Music',
      basePrice: 4000,
      capacity: 1500,
      availableSeats: 1500,
      featured: true
    }
  ];

  await Event.deleteMany({});
  await Event.insertMany(events);
  console.log(`✅ ${events.length} events created!`);

  await mongoose.disconnect();
  console.log('Done! 🎉');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
