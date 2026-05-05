const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Order = require('./models/Order');
const User = require('./models/User');
const Event = require('./models/Event');

async function insertTestTicket() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const user = await User.findOne({ email: 'abetolmunyat@gmail.com' });
  if (!user) { console.log('User not found'); process.exit(1); }

  const event = await Event.findOne({});
  if (!event) { console.log('No events found'); process.exit(1); }

  // Delete old test orders for this user to keep clean
  await Order.deleteMany({ user: user._id });

  const order = new Order({
    user: user._id,
    event: event._id,
    seats: ['A1', 'A2'],
    totalAmount: event.basePrice * 2,
    paymentMethod: 'card',
    paymentIntentId: `test_${Date.now()}`,
    status: 'completed'
  });
  await order.save();
  console.log(`✅ Test ticket created for ${user.name} — Event: ${event.title}`);

  // Verify we can read it back
  const orders = await Order.find({ user: user._id, status: 'completed' }).populate('event');
  console.log(`✅ Can read back ${orders.length} order(s) from DB`);
  console.log(`   → ${orders[0].event.title}, seats: ${orders[0].seats}`);

  await mongoose.disconnect();
  process.exit(0);
}

insertTestTicket().catch(err => { console.error(err); process.exit(1); });
