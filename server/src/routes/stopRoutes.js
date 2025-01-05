import { Router } from 'express';
import { authenticateUser, checkAdmin } from '../middlewares/authMiddleware.js';
import {
  addStop,
  getAllStops,
  getStopById,
  updateStopById,
  deleteStopById,
} from '../controllers/stopController.js';

const router = Router();

// Add a new stop (only accessible by admin)
router.post('/', authenticateUser, checkAdmin, addStop);

// Get all stops (accessible by all users)
router.get('/', authenticateUser, getAllStops);

// Get a specific stop by ID (accessible by all users)
router.get('/:id', authenticateUser, getStopById);

// Update a stop by ID (only accessible by admin)
router.put('/:id', authenticateUser, checkAdmin, updateStopById);

// Delete a stop by ID (only accessible by admin)
router.delete('/:id', authenticateUser, checkAdmin, deleteStopById);

export default router;
