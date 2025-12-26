import express from 'express';
import compression from 'compression';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './server/api.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatnew';

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api', apiRoutes);

const dist = path.join(process.cwd(), 'dist');
app.use(express.static(dist, { maxAge: '1d' }));

// All other requests serve index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
