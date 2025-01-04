import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Import routes
import authRoutes from './routes/authRoutes.js';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
