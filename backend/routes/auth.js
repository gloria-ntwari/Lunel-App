const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateEmailDomain,
  validateEmailDomainForLogin
} = require('../middleware/validation');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUserRegistration, validateEmailDomain, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'user' // Regular users are assigned 'user' role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, validateEmailDomainForLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? '***' : 'missing' });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @route   POST /api/auth/forgot
// @desc    Start password reset flow (send email with token)
// @access  Public
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email. Please sign up first." });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5000';
    const resetLink = `${baseUrl}/api/auth/reset?token=${token}&email=${encodeURIComponent(user.email)}`;

    const subject = 'Lunel Password Reset';
    const text = `You requested a password reset. Use this token: ${token}. Or open: ${resetLink}`;
    const html = `<p>You requested a password reset.</p><p><b>Token:</b> ${token}</p><p>Or click this link: <a href="${resetLink}">${resetLink}</a></p><p>This link expires in 15 minutes.</p>`;
    try { await sendMail({ to: user.email, subject, text, html }); } catch (e) { console.warn('Email send failed', e.message); }

    const payload = { success: true, message: 'If that email exists, a reset link has been sent' };
    if (process.env.NODE_ENV !== 'production') {
      payload.token = token;
      payload.expiresAt = expires.toISOString();
      payload.resetLink = resetLink;
    }
    res.json(payload);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error while initiating reset' });
  }
});

// @route   POST /api/auth/reset
// @desc    Complete password reset with token
// @access  Public
router.post('/reset', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ success: false, message: 'Email, token and new password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password; // will be hashed by pre('save')
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error while resetting password' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password && password !== '********') {
      updateData.password = password;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @route   GET /api/auth/test
// @desc    Test endpoint to check database connection
// @access  Public
router.get('/test', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const adminUser = await User.findOne({ email: 'admin@lunel.com' });
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        totalUsers: userCount,
        adminExists: !!adminUser,
        adminRole: adminUser?.role || 'not found'
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;
