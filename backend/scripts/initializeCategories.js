const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('../models/Category');
const User = require('../models/User');

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });

const initializeCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lunel-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📊 Connected to MongoDB');

    // Find the super admin
    const superAdmin = await User.findOne({ email: 'admin@lunel.com', role: 'super_admin' });
    
    if (!superAdmin) {
      console.log('❌ Super admin not found. Please run `npm run create-admin` first.');
      return;
    }

    // Check if categories already exist
    const existingCategories = await Category.find({ isDefault: true });
    
    if (existingCategories.length > 0) {
      console.log('✅ Default categories already exist:');
      existingCategories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.isDefault ? 'Default' : 'Custom'})`);
      });
      return;
    }

    // Default categories
    const defaultCategories = [
      { 
        name: 'Concert', 
        isDefault: true, 
        isActive: true,
        createdBy: superAdmin._id
      },
      { 
        name: 'Theater', 
        isDefault: true, 
        isActive: true,
        createdBy: superAdmin._id
      },
      { 
        name: 'Sports', 
        isDefault: true, 
        isActive: true,
        createdBy: superAdmin._id
      },
      { 
        name: 'Festival', 
        isDefault: true, 
        isActive: true,
        createdBy: superAdmin._id
      }
    ];

    // Insert default categories
    const createdCategories = await Category.insertMany(defaultCategories);

    console.log('🎉 Default categories created successfully:');
    createdCategories.forEach(cat => {
      console.log(`   - ${cat.name}`);
    });

  } catch (error) {
    console.error('❌ Error initializing categories:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
};

// Run the initialization
initializeCategories();
