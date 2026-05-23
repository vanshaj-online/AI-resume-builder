import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import aiRoutes from './routes/ai.routes';
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';

// Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running smoothly' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});