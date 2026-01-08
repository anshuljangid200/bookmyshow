import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', apiRoutes);

// Database Connection
async function connectDB() {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bms_admin';

    // Proactive fix: If no local mongo detected/requested, use memory server
    if (process.env.USE_MEMORY_DB === 'true' || !process.env.MONGODB_URI) {
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        console.log('Using In-Memory MongoDB for demo');
    }

    mongoose.connect(uri)
        .then(() => {
            console.log('Connected to MongoDB');
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });
}

connectDB();
