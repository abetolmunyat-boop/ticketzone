const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

const { protect, admin } = require('../middleware/auth');

// Seed events (For development)
router.post('/seed', async (req, res) => {
  try {
    const events = [
      {
        title: "The Eras Tour: Taylor Swift",
        description: "Taylor Swift's career-spanning tour celebrating all of her musical eras.",
        longDescription: "Join Taylor Swift for an unforgettable journey through all of her musical 'eras' in this career-spanning stadium tour. Experience the magic of every album from 'Fearless' to 'Midnights' with stunning visuals, choreography, and surprises.",
        date: new Date("2026-08-15T20:00:00"),
        location: "Inglewood, CA",
        venue: "SoFi Stadium",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000",
        category: "Music",
        basePrice: 199,
        capacity: 70000,
        availableSeats: 500,
        featured: true,
        seatingData: {
          sections: [
            { id: 'A', price: 350, rows: 10, seatsPerRow: 20 },
            { id: 'B', price: 199, rows: 20, seatsPerRow: 30 }
          ]
        }
      },
      {
        title: "NBA Finals: Game 1",
        description: "The championship series of the National Basketball Association.",
        longDescription: "The NBA Finals is the annual championship series of the National Basketball Association (NBA). The Eastern and Western Conference champions play a best-of-seven game series to determine the league champion.",
        date: new Date("2026-06-01T19:00:00"),
        location: "Boston, MA",
        venue: "TD Garden",
        image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1000",
        category: "Sports",
        basePrice: 250,
        capacity: 19000,
        availableSeats: 200,
        featured: true,
        seatingData: {
          sections: [
            { id: 'Courtside', price: 1500, rows: 2, seatsPerRow: 50 },
            { id: 'Lodge', price: 450, rows: 15, seatsPerRow: 40 },
            { id: 'Balcony', price: 250, rows: 20, seatsPerRow: 60 }
          ]
        }
      },
      {
        title: "Hamilton: The Musical",
        description: "The story of Alexander Hamilton, an immigrant from the West Indies who became George Washington's right-hand man.",
        longDescription: "Hamilton is the story of America then, told by America now. Featuring a score that blends hip-hop, jazz, R&B and Broadway, Hamilton has taken the story of American founding father Alexander Hamilton and created a revolutionary moment in theatre.",
        date: new Date("2026-07-10T19:00:00"),
        location: "New York, NY",
        venue: "Richard Rodgers Theatre",
        image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1000",
        category: "Arts",
        basePrice: 149,
        capacity: 1300,
        availableSeats: 50,
        featured: true,
        seatingData: {
          sections: [
            { id: 'Orchestra', price: 250, rows: 15, seatsPerRow: 30 },
            { id: 'Mezzanine', price: 149, rows: 10, seatsPerRow: 25 }
          ]
        }
      }
    ];

    await Event.deleteMany({});
    await Event.insertMany(events);
    res.json({ message: "Events seeded successfully" });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get featured events
router.get('/featured', async (req, res) => {
  try {
    const events = await Event.find({ featured: true }).limit(5);
    res.json(events);
  } catch (err) {
    console.error('Error fetching featured events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, date } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Event (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Event (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Event (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(`Error fetching event ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
