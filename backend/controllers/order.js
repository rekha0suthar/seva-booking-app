import Order from '../models/Order.js';

const addOrder = async (req, res) => {
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
};

const getOrders = async (req, res) => {
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
};

export { addOrder, getOrders };
