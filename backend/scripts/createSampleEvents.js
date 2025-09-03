const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Event = require('../models/Event');
const User = require('../models/User');

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });

const createSampleEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lunel-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📊 Connected to MongoDB');

    // Find the admin user
    const admin = await User.findOne({ email: 'admin@lunel.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Please run `npm run create-admin` first.');
      return;
    }

    // Check if sample events already exist
    const existingEvents = await Event.find({ createdBy: admin._id });
    
    if (existingEvents.length > 0) {
      console.log('✅ Sample events already exist:');
      existingEvents.forEach(event => {
        console.log(`   - ${event.title} (${event.category})`);
      });
      return;
    }

    // Sample events data
    const sampleEvents = [
      {
        title: 'Welcome Concert',
        description: 'A special welcome concert for new students featuring local artists and bands.',
        category: 'Concert',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 6 PM
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000), // 9 PM
        location: 'Main Auditorium',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        maxAttendees: 200,
        currentAttendees: 0,
        isActive: true,
        createdBy: admin._id
      },
      {
        title: 'Theater Workshop',
        description: 'Learn the basics of theater and acting in this interactive workshop.',
        category: 'Theater',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 2 PM
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5 PM
        location: 'Drama Studio',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        maxAttendees: 30,
        currentAttendees: 0,
        isActive: true,
        createdBy: admin._id
      },
      {
        title: 'Basketball Tournament',
        description: 'Annual inter-house basketball tournament. Come support your house!',
        category: 'Sports',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 10 AM
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 4 PM
        location: 'Sports Complex',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        maxAttendees: 100,
        currentAttendees: 0,
        isActive: true,
        createdBy: admin._id
      },
      {
        title: 'Spring Festival',
        description: 'Celebrate the arrival of spring with food, music, and fun activities.',
        category: 'Festival',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // 12 PM
        endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // 8 PM
        location: 'Main Campus Grounds',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        maxAttendees: 500,
        currentAttendees: 0,
        isActive: true,
        createdBy: admin._id
      }
    ];

    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);

    console.log('🎉 Sample events created successfully:');
    createdEvents.forEach(event => {
      console.log(`   - ${event.title} (${event.category}) - ${event.date.toLocaleDateString()}`);
    });

  } catch (error) {
    console.error('❌ Error creating sample events:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
};

// Run the script
createSampleEvents();
