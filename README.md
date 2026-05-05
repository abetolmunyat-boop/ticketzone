# TicketsZone - Ticketmaster Replica

A fully functional, premium-designed Ticketmaster replica built with React, Node.js, and MongoDB.

## Features
- **Event Discovery**: Search and filter events by category.
- **Interactive Seating**: Select specific seats from a visual map.
- **Secure Checkout**: Integrated with Stripe (Test Mode).
- **User Profiles**: Manage tickets and view QR codes for entry.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Update `.env` with your MongoDB URI and Stripe keys.
4. Run `node server.js`
5. Seed data: `POST http://localhost:5000/api/events/seed`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Tech Stack
- **Frontend**: Vite, React, Vanilla CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, Mongoose.
- **Payments**: Stripe API.
