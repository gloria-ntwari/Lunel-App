const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const Event = require('../models/Event');
const Meal = require('../models/Meal');
const User = require('../models/User');

const router = express.Router();

// Overview stats for admin profile/dashboard
router.get('/overview', auth, requireRole(['super_admin','admin','event_manager','meal_coordinator']), async (req, res) => {
  try {
    const [events, meals, users, admins, students] = await Promise.all([
      Event.countDocuments({ isActive: true }),
      Meal.countDocuments({ isActive: true }),
      User.countDocuments({}),
      User.countDocuments({ role: { $in: ['admin','super_admin','event_manager','meal_coordinator'] } }),
      User.countDocuments({ role: 'user' })
    ]);

    res.json({
      success: true,
      data: {
        events,
        meals,
        users,
        admins,
        students,
      }
    });
  } catch (e) {
    console.error('Stats overview error:', e);
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

module.exports = router;


