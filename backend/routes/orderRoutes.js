import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// [POST] /api/order - Create new order
router.post('/', async (req, res) => {
  const { items, address, userContact } = req.body;

  try {
    const order = await Order.create({ items, address, userContact });

    res.status(201).json({
      orderId: order._id,
      paymentId: 'PAY' + Date.now(),
      amountToPay: items.reduce((sum, i) => sum + i.discountedPrice, 0),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// [GET] /api/orders/latest - Get last 3 orders
router.get('/:userId/latest', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById({ _id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const orders = await Order.find({ userContact: user.contact })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(orders);
  } catch (err) {
    console.error('Error fetching latest orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
