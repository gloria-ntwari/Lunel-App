const express = require('express');
const Meal = require('../models/Meal');
const { auth, requireRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Meal validation
const validateMeal = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('day')
    .isIn(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'])
    .withMessage('Invalid day'),
  
  body('mealType')
    .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack'])
    .withMessage('Invalid meal type'),
  
  body('menu')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Menu is required'),
  
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a string'),
  
  handleValidationErrors
];

// @route   GET /api/meals
// @desc    Get all meals with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { mealType, day } = req.query;
    let query = { isActive: true };

    // Add meal type filter if provided
    if (mealType && mealType !== 'all') {
      query.mealType = mealType;
    }

    if (day) {
      query.day = day;
    }

    const meals = await Meal.find(query)
      .populate('createdBy', 'name email')
      .sort({ day: 1, mealType: 1 });

    res.json({
      success: true,
      data: {
        meals,
        count: meals.length
      }
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meals'
    });
  }
});

// @route   GET /api/meals/:id
// @desc    Get single meal by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      data: { meal }
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meal'
    });
  }
});

// @route   POST /api/meals
// @desc    Create new meal
// @access  Private (Admin only)
router.post('/', auth, requireRole(['admin', 'super_admin', 'meal_coordinator']), validateMeal, async (req, res) => {
  try {
    const mealData = {
      ...req.body,
      createdBy: req.user._id
    };

    const meal = new Meal(mealData);
    await meal.save();

    const populatedMeal = await Meal.findById(meal._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: { meal: populatedMeal }
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating meal'
    });
  }
});

// @route   PUT /api/meals/:id
// @desc    Update meal
// @access  Private (Admin only)
router.put('/:id', auth, requireRole(['admin', 'super_admin', 'meal_coordinator']), validateMeal, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Meal updated successfully',
      data: { meal: updatedMeal }
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meal'
    });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete meal
// @access  Private (Admin only)
router.delete('/:id', auth, requireRole(['admin', 'super_admin', 'meal_coordinator']), async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    await Meal.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting meal'
    });
  }
});

// @route   GET /api/meals/date/:date
// @desc    Get meals for a specific date
// @access  Private
router.get('/day/:day', auth, async (req, res) => {
  try {
    const { day } = req.params;
    const meals = await Meal.find({ day, isActive: true })
      .populate('createdBy', 'name email')
      .sort({ mealType: 1 });
    res.json({ success: true, data: meals });
  } catch (error) {
    console.error('Get meals by day error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching meals by day' });
  }
});

module.exports = router;
