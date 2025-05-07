import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import sevaRoutes from './routes/sevaRoutes';

dotenv.config();

const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/sevas', sevaRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server is listening on port ${port}`));
