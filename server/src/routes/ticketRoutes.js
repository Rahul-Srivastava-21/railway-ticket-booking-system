import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { bookTicket, getTicket, getUserTickets, cancelTicket } from '../controllers/ticketController.js';

const router = express.Router();

// Routes related to ticket booking
router.post('/book', authenticateUser, bookTicket);       // Book a new ticket
router.get('/:ticketId', authenticateUser, getTicket);    // Get a specific ticket details
router.get('/', authenticateUser, getUserTickets);        // Get all tickets for the logged-in user
router.post('/cancel', authenticateUser, cancelTicket);   // Cancel a booked ticket

export default router;
