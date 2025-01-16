import { Router } from 'express';
import { cancelBooking, getBookingHistory,createBooking } from '../controllers/bookingController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = Router();
//Create a booking  
router.post('/', authenticateUser, createBooking);

// Cancel a booking
router.delete('/:id', authenticateUser, cancelBooking);

// Get booking history
router.get('/', authenticateUser, getBookingHistory);

export default router;
