import express from 'express';
import { searchTrains } from '../controllers/searchController.js';

const router = express.Router();

// Route to search trains
router.get('/', searchTrains);

export default router;
