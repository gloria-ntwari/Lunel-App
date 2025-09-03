const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  image: {
    type: String,
    default: null
  },
  maxAttendees: {
    type: Number,
    min: [1, 'Max attendees must be at least 1'],
    default: null
  },
  currentAttendees: {
    type: Number,
    default: 0,
    min: [0, 'Current attendees cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for checking if event is completed (date has passed)
eventSchema.virtual('isCompleted').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  eventDate.setHours(23, 59, 59, 999); // End of the day
  return eventDate < now;
});

// Virtual for checking if event is today
eventSchema.virtual('isToday').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  return eventDate.toDateString() === now.toDateString();
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  return eventDate > now && !this.isCancelled;
});

// Virtual for checking if event is cancelled
eventSchema.virtual('isCancelledEvent').get(function() {
  return this.isCancelled;
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
