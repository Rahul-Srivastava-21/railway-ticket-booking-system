import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Import routes
import authRoutes from './routes/authRoutes.js';
// import ticketRoutes from './routes/ticketRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import trainRoutes from './routes/trainRoutes.js'; 
import trainRouteRoutes from './routes/trainRouteRoutes.js'; 
import stopRoutes from './routes/stopRoutes.js'; // Import stop routes
import bookingRoutes from './routes/bookingRoutes.js';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/tickets', ticketRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/routes', trainRouteRoutes);
app.use('/api/stops', stopRoutes); 
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
