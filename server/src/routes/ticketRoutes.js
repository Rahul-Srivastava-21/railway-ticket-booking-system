import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { fetchTicketDetails, generatePDFTicket } from '../controllers/ticketController.js';

const router = express.Router();

// Fetch ticket details
router.get('/:id', authenticateUser, fetchTicketDetails);

// Generate PDF ticket
router.get('/:id/pdf', authenticateUser, generatePDFTicket);

export default router;
