const express = require('express');
const Notification = require('../models/Notification');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// List notifications (latest first)
router.get('/', auth, async (req, res) => {
  const list = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, data: { notifications: list } });
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  const count = await Notification.countDocuments({ isRead: false });
  res.json({ success: true, data: { unreadCount: count } });
});

// Mark all as read
router.post('/mark-all-read', auth, async (req, res) => {
  await Notification.updateMany({}, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});

// Mark as read
router.post('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }
    
    const n = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: { notification: n } });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, message: 'Server error while marking notification as read' });
  }
});

// Clear all (admins only)
router.delete('/', auth, requireRole(['super_admin']), async (req, res) => {
  await Notification.deleteMany({});
  res.json({ success: true, message: 'All notifications cleared' });
});

module.exports = router;


