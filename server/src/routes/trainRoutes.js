import { Router } from 'express';
import { addTrain, getAllTrains, getTrainById, updateTrainById, deleteTrainById } from '../controllers/trainController.js';
import { authenticateUser, checkAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Add a new train (only accessible by admin)
router.post('/', authenticateUser, checkAdmin, addTrain);

// Get all trains (accessible by all users)
router.get('/',authenticateUser, getAllTrains);

// Get a specific train by ID (accessible by all users)
router.get('/:id',authenticateUser, getTrainById);

// Update a train by ID (only accessible by admin)
router.put('/:id', authenticateUser, checkAdmin, updateTrainById);

// Delete a train by ID (only accessible by admin)
router.delete('/:id', authenticateUser, checkAdmin, deleteTrainById);


export default router;
