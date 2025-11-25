import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's health data
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Sample health data - in production this would come from database
    const healthData = [
      {
        date: new Date(),
        heartRate: 75,
        sleepHours: 8,
        steps: 8500,
        waterIntake: 2.5
      }
    ];

    res.json({
      success: true,
      data: healthData
    });
  } catch (error) {
    console.error('Health data fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add health data
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, value, date } = req.body;

    // TODO: Save to database
    res.json({
      success: true,
      message: 'Health data recorded successfully'
    });
  } catch (error) {
    console.error('Health data creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
