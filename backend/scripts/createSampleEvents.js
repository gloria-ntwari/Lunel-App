const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

const createSampleEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lunel-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find the admin user to use as creator
    const adminUser = await User.findOne({ email: 'admin@lunel.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Please create admin first.');
      process.exit(1);
    }

    // Check if events already exist
    const existingEvents = await Event.countDocuments();
    if (existingEvents > 0) {
      console.log('Events already exist in database!');
      process.exit(0);
    }

    // Create sample events
    const sampleEvents = [
      {
        title: 'KAZKA Band Concert',
        description: 'An amazing concert by the popular Ukrainian band KAZKA',
        category: 'Concert',
        date: new Date('2024-12-20'),
        startTime: new Date('2024-12-20T19:00:00'),
        endTime: new Date('2024-12-20T22:00:00'),
        location: 'Kyiv Concert Hall',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        maxAttendees: 500,
        currentAttendees: 0,
        createdBy: adminUser._id
      },
      {
        title: 'Theater Performance - Hamlet',
        description: 'Classic Shakespeare play performed by the National Theater',
        category: 'Theater',
        date: new Date('2024-12-18'),
        startTime: new Date('2024-12-18T14:00:00'),
        endTime: new Date('2024-12-18T16:30:00'),
        location: 'National Theater',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        maxAttendees: 200,
        currentAttendees: 0,
        createdBy: adminUser._id
      },
      {
        title: 'Basketball Tournament',
        description: 'Annual university basketball championship',
        category: 'Sports',
        date: new Date('2024-12-22'),
        startTime: new Date('2024-12-22T10:00:00'),
        endTime: new Date('2024-12-22T18:00:00'),
        location: 'Sports Complex',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        maxAttendees: 1000,
        currentAttendees: 0,
        createdBy: adminUser._id
      },
      {
        title: 'Art Exhibition - Modern Masters',
        description: 'Contemporary art exhibition featuring local and international artists',
        category: 'Exhibition',
        date: new Date('2024-12-15'),
        startTime: new Date('2024-12-15T09:00:00'),
        endTime: new Date('2024-12-15T17:00:00'),
        location: 'Art Gallery',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
        maxAttendees: 300,
        currentAttendees: 0,
        createdBy: adminUser._id
      },
      {
        title: 'Programming Workshop',
        description: 'Learn React Native development from scratch',
        category: 'Workshop',
        date: new Date('2024-12-25'),
        startTime: new Date('2024-12-25T10:00:00'),
        endTime: new Date('2024-12-25T16:00:00'),
        location: 'Computer Lab',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        maxAttendees: 50,
        currentAttendees: 0,
        createdBy: adminUser._id
      },
      {
        title: 'Student Council Meeting',
        description: 'Monthly student council meeting to discuss campus issues',
        category: 'Meeting',
        date: new Date('2024-12-12'),
        startTime: new Date('2024-12-12T15:00:00'),
        endTime: new Date('2024-12-12T17:00:00'),
        location: 'Student Center',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        maxAttendees: 100,
        currentAttendees: 0,
        createdBy: adminUser._id
      }
    ];

    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);

    console.log('✅ Sample events created successfully!');
    console.log(`Created ${createdEvents.length} events:`);
    createdEvents.forEach(event => {
      console.log(`- ${event.title} (${event.category}) - ${event.date.toDateString()}`);
    });

  } catch (error) {
    console.error('Error creating sample events:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
createSampleEvents();
