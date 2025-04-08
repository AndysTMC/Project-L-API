import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from "./config/db"
import { userRoutes } from './routes/user';

dotenv.config();

connectDB();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/little-later';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})