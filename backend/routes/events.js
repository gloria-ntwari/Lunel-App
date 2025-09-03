const express = require('express');
const Event = require('../models/Event');
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

// Event validation
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category is required'),
  
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('startTime')
    .isISO8601()
    .withMessage('Invalid start time format'),
  
  body('endTime')
    .isISO8601()
    .withMessage('Invalid end time format'),
  
  body('location')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Location must be between 1 and 100 characters'),
  
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a string'),
  
  body('maxAttendees')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attendees must be a positive integer'),
  
  handleValidationErrors
];

// @route   GET /api/events
// @desc    Get all events with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { filter, category } = req.query;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let query = { isActive: true };

    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add date filter
    if (filter === 'today') {
      query.date = {
        $gte: today,
        $lt: tomorrow
      };
    } else if (filter === 'upcoming') {
      query.date = { $gte: tomorrow };
    } else if (filter === 'completed') {
      query.date = { $lt: today };
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      data: {
        events,
        count: events.length
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin only)
router.post('/', auth, requireRole(['admin', 'super_admin', 'event_manager']), validateEvent, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Validate that end time is after start time
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    
    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    const event = new Event(eventData);
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event: populatedEvent }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin only)
router.put('/:id', auth, requireRole(['admin', 'super_admin', 'event_manager']), validateEvent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validate that end time is after start time
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    
    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin only)
router.delete('/:id', auth, requireRole(['admin', 'super_admin', 'event_manager']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

// @route   PATCH /api/events/:id/cancel
// @desc    Cancel event
// @access  Private (Admin only)
router.patch('/:id/cancel', auth, requireRole(['admin', 'super_admin', 'event_manager']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.isCancelled) {
      return res.status(400).json({
        success: false,
        message: 'Event is already cancelled'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        isCancelled: true,
        cancelledAt: new Date(),
        cancelledBy: req.user._id
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Event cancelled successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Cancel event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling event'
    });
  }
});

// @route   GET /api/events/date/:date
// @desc    Get events for a specific date
// @access  Private
router.get('/date/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const dateObj = new Date(date);
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);

    const events = await Event.find({
      date: {
        $gte: dateObj,
        $lt: nextDay
      },
      isActive: true
    })
    .populate('createdBy', 'name email')
    .sort({ startTime: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get events by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events by date'
    });
  }
});

// @route   GET /api/events/month/:year/:month
// @desc    Get events for a specific month (for calendar dots)
// @access  Private
router.get('/month/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const events = await Event.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      isActive: true
    })
    .populate('createdBy', 'name email')
    .select('date title');

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get events by month error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events by month'
    });
  }
});

// @route   GET /api/events/stats/overview
// @desc    Get event statistics
// @access  Private (Admin only)
router.get('/stats/overview', auth, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalEvents, todayEvents, upcomingEvents, completedEvents] = await Promise.all([
      Event.countDocuments({ isActive: true }),
      Event.countDocuments({ 
        isActive: true, 
        date: { $gte: today, $lt: tomorrow } 
      }),
      Event.countDocuments({ 
        isActive: true, 
        date: { $gte: tomorrow } 
      }),
      Event.countDocuments({ 
        isActive: true, 
        date: { $lt: today } 
      })
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        todayEvents,
        upcomingEvents,
        completedEvents
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event statistics'
    });
  }
});

module.exports = router;
