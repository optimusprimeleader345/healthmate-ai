import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's medications
router.get('/', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      medications: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
