const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lunel-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lunel.com' });
    
    if (existingAdmin) {
      console.log('Super admin already exists!');
      console.log('Email: admin@lunel.com');
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create super admin
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@lunel.com',
      password: 'admin123',
      role: 'super_admin',
      isActive: true
    });

    await superAdmin.save();

    console.log('✅ Super admin created successfully!');
    console.log('Email: admin@lunel.com');
    console.log('Password: admin123');
    console.log('Role: super_admin');

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
createSuperAdmin();
