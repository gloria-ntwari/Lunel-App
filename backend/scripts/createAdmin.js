const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lunel-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📊 Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lunel.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Name: ${existingAdmin.name}`);
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@lunel.com',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    });

    await admin.save();

    console.log('🎉 Super admin created successfully:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Name: ${admin.name}`);

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
};

// Run the script
createAdmin();
