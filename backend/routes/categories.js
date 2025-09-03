const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/categories
// @desc    Get all active categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ isDefault: -1, name: 1 })
      .select('name isDefault');
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/categories/admin
// @desc    Get all categories (including inactive) for admin
// @access  Private (Admin only)
router.get('/admin', auth, async (req, res) => {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const categories = await Category.find()
      .sort({ isDefault: -1, name: 1 })
      .populate('createdBy', 'name email');
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin only)
router.post('/', [
  auth,
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Category name can only contain letters, numbers, and spaces')
], async (req, res) => {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: 'Category already exists' 
      });
    }

    // Create new category
    const category = new Category({
      name: name.trim(),
      isDefault: false,
      createdBy: req.user.id
    });

    await category.save();

    // Populate the createdBy field for response
    await category.populate('createdBy', 'name email');

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Category name can only contain letters, numbers, and spaces')
], async (req, res) => {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name } = req.body;
    const categoryId = req.params.id;

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name already exists (excluding current category)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: categoryId }
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: 'Category name already exists' 
      });
    }

    // Update category
    category.name = name.trim();
    await category.save();

    // Populate the createdBy field for response
    await category.populate('createdBy', 'name email');

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const categoryId = req.params.id;

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is being used by any events
    const Event = require('../models/Event');
    const eventsUsingCategory = await Event.countDocuments({ 
      category: category.name,
      isActive: true 
    });

    if (eventsUsingCategory > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It is being used by ${eventsUsingCategory} active event(s).` 
      });
    }

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/categories/initialize
// @desc    Initialize default categories
// @access  Private (Admin only)
router.post('/initialize', auth, async (req, res) => {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const defaultCategories = ['Concert', 'Theater', 'Sports', 'Festival'];

    // Check if default categories already exist
    const existingCategories = await Category.find({ isDefault: true });
    if (existingCategories.length > 0) {
      return res.status(400).json({ 
        message: 'Default categories already exist' 
      });
    }

    // Create default categories
    const categories = defaultCategories.map(name => ({
      name,
      isDefault: true,
      isActive: true
    }));

    await Category.insertMany(categories);

    res.json({ message: 'Default categories initialized successfully' });
  } catch (error) {
    console.error('Error initializing categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
