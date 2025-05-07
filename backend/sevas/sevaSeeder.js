import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../utils/db.js';
import Seva from '../models/Seva.js';

dotenv.config();

connectDB();

const sevas = [
  {
    code: 'SVA001',
    title: 'Abhishekam',
    tags: ['puja', 'devotion'],
    description: 'A sacred bath ritual performed to honor the deity.',
    marketPrice: 1000,
    discountedPrice: 800,
    start: '2025-05-01',
    end: '2025-05-31',
    amountRaised: 5000,
    targetAmount: 10000,
    media: 'https://picsum.photos/200?random=1',
  },
  {
    code: 'SVA002',
    title: 'Satyanarayan Puja',
    tags: ['puja', 'family', 'peace'],
    description: 'A puja for family harmony and blessings.',
    marketPrice: 2000,
    discountedPrice: 1600,
    start: '2025-05-01',
    end: '2025-05-31',
    amountRaised: 8000,
    targetAmount: 15000,
    media: 'https://picsum.photos/200?random=2',
  },
];

const addSevas = async () => {
  try {
    await Seva.deleteMany();
    await Seva.insertMany(sevas);
    console.log('Sevas data added');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addSevas();
