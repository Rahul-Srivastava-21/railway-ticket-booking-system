import { Router } from 'express';
import {
  addTrainRoute,
  updateTrainRoute,
  deleteTrainRoute,
} from '../controllers/trainRouteController.js';
import { authenticateUser, checkAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Add a new train route (Admin only)
router.post('/', authenticateUser, checkAdmin, addTrainRoute);

// Update a train route (Admin only)
router.put('/:id', authenticateUser, checkAdmin, updateTrainRoute);

// Delete a train route (Admin only)
router.delete('/:id', authenticateUser, checkAdmin, deleteTrainRoute);

export default router;
