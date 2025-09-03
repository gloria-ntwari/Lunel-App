const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { auth, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};

const validateCreate = [
  body('name').trim().isLength({ min: 1, max: 50 }),
  body('email').isEmail(),
  body('role').isIn(['admin','super_admin','event_manager','meal_coordinator']),
  handleValidationErrors,
];

// List admins
router.get('/', auth, requireRole(['super_admin']), async (req, res) => {
  const admins = await User.find({ role: { $in: ['admin','super_admin','event_manager','meal_coordinator'] } })
    .select('-password')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: { admins } });
});

// Create admin (super_admin only)
router.post('/', auth, requireRole(['super_admin']), validateCreate, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const defaultPassword = crypto.randomBytes(4).toString('hex'); // 8 chars
    const user = new User({ name, email: email.toLowerCase(), password: defaultPassword, role });
    await user.save();

    // Email default password
    const subject = 'Your Lunel admin account details';
    const text = `Hello ${name},\n\nYour admin account has been created.\nEmail: ${email}\nTemporary password: ${defaultPassword}\n\nYou can change your password anytime in your profile.\n\nRegards,\nLunel Team`;
    const html = `<p>Hello ${name},</p><p>Your admin account has been created.</p><p><b>Email:</b> ${email}<br/><b>Temporary password:</b> ${defaultPassword}</p><p>You can change your password anytime in your profile.</p><p>Regards,<br/>Lunel Team</p>`;
    try { await sendMail({ to: email, subject, text, html }); } catch (e) { console.warn('Email send failed', e.message); }

    res.status(201).json({ success: true, message: 'Admin created and email sent', data: { user: user.toJSON() } });
  } catch (e) {
    console.error('Create admin error:', e);
    res.status(500).json({ success: false, message: 'Server error while creating admin' });
  }
});

// Update admin (name, role, active)
router.put('/:id', auth, requireRole(['super_admin']), async (req, res) => {
  try {
    const allowed = ['name', 'role', 'isActive'];
    const updates = {};
    for (const key of allowed) if (key in req.body) updates[key] = req.body[key];
    if (updates.role && !['admin','super_admin','event_manager','meal_coordinator'].includes(updates.role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.json({ success: true, message: 'Admin updated', data: { user } });
  } catch (e) {
    console.error('Update admin error:', e);
    res.status(500).json({ success: false, message: 'Server error while updating admin' });
  }
});

// Delete admin (cannot delete self)
router.delete('/:id', auth, requireRole(['super_admin']), async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Admin not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin deleted' });
  } catch (e) {
    console.error('Delete admin error:', e);
    res.status(500).json({ success: false, message: 'Server error while deleting admin' });
  }
});

module.exports = router;


