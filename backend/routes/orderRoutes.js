import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { addOrder, getOrders } from '../controllers/order.js';

const router = express.Router();

// [POST] /api/order - Create new order
router.post('/', addOrder);

// [GET] /api/orders/latest - Get last 3 orders
router.get('/:userId/latest', getOrders);

export default router;
