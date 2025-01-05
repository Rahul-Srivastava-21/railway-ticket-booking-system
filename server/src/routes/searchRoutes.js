import { Router } from 'express';
import { searchTrains } from '../controllers/searchController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = Router();

// Search for trains (accessible by all users)
router.get('/trains', authenticateUser, searchTrains );

export default router;