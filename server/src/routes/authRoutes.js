import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateRegister, validateLogin, authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticateUser, getProfile);

export default router;
