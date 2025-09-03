const express = require('express');
const Notification = require('../models/Notification');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// List notifications (latest first)
router.get('/', auth, async (req, res) => {
  const list = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, data: { notifications: list } });
});

// Mark as read
router.post('/:id/read', auth, async (req, res) => {
  const n = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
  res.json({ success: true, data: { notification: n } });
});

// Clear all (admins only)
router.delete('/', auth, requireRole(['super_admin']), async (req, res) => {
  await Notification.deleteMany({});
  res.json({ success: true, message: 'All notifications cleared' });
});

module.exports = router;


