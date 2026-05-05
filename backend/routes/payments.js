const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, eventId, seats, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { userId, eventId, seats: JSON.stringify(seats) }
    });

    const order = new Order({
      user: userId,
      event: eventId,
      seats: seats,
      totalAmount: amount,
      paymentIntentId: paymentIntent.id,
      status: 'pending'
    });
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: 'Payment error: ' + err.message });
  }
});

// Confirm Payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'completed';
    await order.save();
    res.json({ message: 'Payment confirmed and order completed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/user-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, status: 'completed' })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
