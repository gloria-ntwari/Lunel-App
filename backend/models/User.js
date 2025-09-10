const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin', 'event_manager', 'meal_coordinator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure password is hashed when updated via findOneAndUpdate / findByIdAndUpdate
userSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();
    if (!update) return next();

    // Normalize to direct fields regardless of $set usage
    const updateDoc = update.$set ? update.$set : update;

    if (updateDoc.password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(updateDoc.password, salt);
      updateDoc.password = hashed;
      if (update.$set) {
        update.$set.password = hashed;
      } else {
        this.setUpdate(updateDoc);
      }
    }

    // Always bump updatedAt on updates
    updateDoc.updatedAt = Date.now();
    if (update.$set) {
      update.$set.updatedAt = updateDoc.updatedAt;
    } else {
      this.setUpdate(updateDoc);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
