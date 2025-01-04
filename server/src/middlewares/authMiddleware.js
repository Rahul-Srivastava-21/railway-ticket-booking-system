import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Validate JWT token
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// Zod schema validation for registration
const validateRegister = (req, res, next) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(12),
    name: z.string().min(2),
  });

  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};

// Zod schema validation for login
const validateLogin = (req, res, next) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(12),
  });

  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};

export { authenticateUser, validateRegister, validateLogin };