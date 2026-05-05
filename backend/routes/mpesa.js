const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// Simulate M-Pesa STK Push
router.post('/stk-push', protect, async (req, res) => {
  try {
    const { amount, phoneNumber, eventId, seats } = req.body;

    // In a real app, you would call Safaricom Daraja API here
    console.log(`Simulating M-Pesa STK Push for ${phoneNumber} - Amount: ${amount}`);

    // Simulate a successful trigger
    const checkoutRequestId = 'ws_CO_04052026123456789';
    
    // Create a pending order
    const order = new Order({
      user: req.user._id,
      event: eventId,
      seats: seats,
      totalAmount: amount,
      paymentMethod: 'mpesa',
      status: 'pending',
      paymentIntentId: checkoutRequestId // Using checkoutRequestId as placeholder
    });
    await order.save();

    res.json({
      message: 'STK Push sent successfully. Please check your phone.',
      checkoutRequestId,
      orderId: order._id
    });

    // Simulate callback after 10 seconds
    setTimeout(async () => {
      order.status = 'completed';
      await order.save();
      console.log(`Simulated M-Pesa Payment Completed for Order: ${order._id}`);
    }, 10000);

  } catch (err) {
    res.status(500).json({ message: 'M-Pesa error: ' + err.message });
  }
});

// Simulate Callback (Optional, but good for completeness)
router.post('/callback', async (req, res) => {
  // Real Daraja API calls this
  console.log('M-Pesa Callback Received:', req.body);
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

module.exports = router;
