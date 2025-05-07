import dotenv from 'dotenv';
import connectDB from '../utils/db.js';
import Seva from '../models/Seva.js';

dotenv.config();

connectDB();

const sevas = [
  {
    code: 'SVA001',
    title: 'Abhishekam',
    description: 'A sacred ritual bathing of deity idols with holy substances.',
    tags: ['puja', 'shiva'],
    marketPrice: 1000,
    discountedPrice: 800,
    media: 'https://picsum.photos/200?1',
  },
  {
    code: 'SVA002',
    title: 'Satyanarayan Puja',
    description: 'A ritual to bring family well-being and harmony.',
    tags: ['family', 'prosperity'],
    marketPrice: 2000,
    discountedPrice: 1600,
    media: 'https://picsum.photos/200?2',
  },
  {
    code: 'SVA003',
    title: 'Rudrabhishekam',
    description: 'A powerful puja for Lord Shiva to remove negative energies.',
    tags: ['energy', 'shiva'],
    marketPrice: 2500,
    discountedPrice: 2100,
    media: 'https://picsum.photos/200?3',
  },
  {
    code: 'SVA004',
    title: 'Lakshmi Kubera Homam',
    description: 'Fire ritual to attract wealth and abundance.',
    tags: ['wealth', 'homam'],
    marketPrice: 3000,
    discountedPrice: 2700,
    media: 'https://picsum.photos/200?4',
  },
  {
    code: 'SVA005',
    title: 'Ganapathi Homam',
    description: 'Performed to remove obstacles and ensure success.',
    tags: ['ganesha', 'beginnings'],
    marketPrice: 1500,
    discountedPrice: 1300,
    media: 'https://picsum.photos/200?5',
  },
  {
    code: 'SVA006',
    title: 'Navagraha Shanti',
    description: 'Pacify the nine planetary gods to remove doshas.',
    tags: ['astrology', 'graha'],
    marketPrice: 2200,
    discountedPrice: 1900,
    media: 'https://picsum.photos/200?6',
  },
  {
    code: 'SVA007',
    title: 'Hanuman Chalisa Path',
    description: 'Chanting session for protection and courage.',
    tags: ['hanuman', 'chant'],
    marketPrice: 700,
    discountedPrice: 600,
    media: 'https://picsum.photos/200?7',
  },
  {
    code: 'SVA008',
    title: 'Durga Saptashati',
    description: 'Recital of 700 verses invoking Goddess Durga’s power.',
    tags: ['durga', 'power'],
    marketPrice: 2500,
    discountedPrice: 2200,
    media: 'https://picsum.photos/200?8',
  },
  {
    code: 'SVA009',
    title: 'Tarpanam',
    description: 'Ancestral offering to ensure peace and blessings.',
    tags: ['ancestor', 'peace'],
    marketPrice: 900,
    discountedPrice: 750,
    media: 'https://picsum.photos/200?9',
  },
  {
    code: 'SVA010',
    title: 'Maha Mrityunjaya Jaap',
    description: 'A powerful chant for health and longevity.',
    tags: ['health', 'mrityunjaya'],
    marketPrice: 3500,
    discountedPrice: 3100,
    media: 'https://picsum.photos/200?10',
  },
  {
    code: 'SVA011',
    title: 'Sundarakanda Path',
    description: 'Reading of Sundarkanda to remove fear and sorrow.',
    tags: ['ramayana', 'hope'],
    marketPrice: 1800,
    discountedPrice: 1600,
    media: 'https://picsum.photos/200?11',
  },
  {
    code: 'SVA012',
    title: 'Chandi Homam',
    description: 'Advanced ritual for overcoming obstacles and fear.',
    tags: ['protection', 'chandi'],
    marketPrice: 4000,
    discountedPrice: 3600,
    media: 'https://picsum.photos/200?12',
  },
  {
    code: 'SVA013',
    title: 'Sudarsana Homam',
    description: 'Protection from evil forces and quick success.',
    tags: ['sudarsana', 'vishnu'],
    marketPrice: 2800,
    discountedPrice: 2500,
    media: 'https://picsum.photos/200?13',
  },
  {
    code: 'SVA014',
    title: 'Nakshatra Puja',
    description: 'Puja for strengthening your birth star.',
    tags: ['nakshatra', 'personal'],
    marketPrice: 1600,
    discountedPrice: 1400,
    media: 'https://picsum.photos/200?14',
  },
  {
    code: 'SVA015',
    title: 'Online Pandit Consultation',
    description: 'Talk to a pandit for spiritual guidance and remedy.',
    tags: ['consultation', 'online'],
    marketPrice: 1200,
    discountedPrice: 1000,
    media: 'https://picsum.photos/200?15',
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
