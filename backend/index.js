import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sevaRoutes from './routes/sevaRoutes.js';
import connectDB from './utils/db.js';
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());

// mongodb connection
connectDB();

// apis endpoint
app.use('/api/sevas', sevaRoutes);
app.use('/api/users', userRoutes);
app.use('/api', addressRoutes);
app.use('/api/orders', orderRoutes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
