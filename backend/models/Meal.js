const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Meal title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  day: {
    type: String,
    required: [true, 'Meal day is required'],
    enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  },
  mealType: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    default: 'Lunch'
  },
  menu: {
    type: String,
    required: [true, 'Menu is required'],
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
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
mealSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for checking if meal is today
mealSchema.virtual('isToday').get(function() {
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = dayNames[new Date().getDay()];
  return this.day === todayName;
});

// Virtual for checking if meal is upcoming
mealSchema.virtual('isUpcoming').get(function() {
  return false;
});

// Ensure virtual fields are serialized
mealSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Meal', mealSchema);
