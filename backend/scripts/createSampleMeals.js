const mongoose = require('mongoose');
const Meal = require('../models/Meal');
const User = require('../models/User');
require('dotenv').config();

const createSampleMeals = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@lunel.com' });
    if (!adminUser) {
      console.error('Admin user not found. Please run createAdmin.js first.');
      process.exit(1);
    }

    // Clear existing meals
    await Meal.deleteMany({});
    console.log('Cleared existing meals');

    // Create sample meals
    const sampleMeals = [
      {
        title: 'Monday Breakfast',
        description: 'A healthy start to your week',
        date: new Date('2024-01-15'),
        mealType: 'Breakfast',
        menu: 'Oatmeal with berries, yogurt, whole grain toast, orange juice',
        createdBy: adminUser._id
      },
      {
        title: 'Monday Lunch',
        description: 'Nutritious midday meal',
        date: new Date('2024-01-15'),
        mealType: 'Lunch',
        menu: 'Grilled chicken salad, quinoa, steamed vegetables, apple',
        createdBy: adminUser._id
      },
      {
        title: 'Monday Dinner',
        description: 'Comforting evening meal',
        date: new Date('2024-01-15'),
        mealType: 'Dinner',
        menu: 'Salmon with rice, roasted vegetables, soup',
        createdBy: adminUser._id
      },
      {
        title: 'Tuesday Breakfast',
        description: 'Energizing morning meal',
        date: new Date('2024-01-16'),
        mealType: 'Breakfast',
        menu: 'Scrambled eggs, bacon, hash browns, coffee',
        createdBy: adminUser._id
      },
      {
        title: 'Tuesday Lunch',
        description: 'Light and fresh lunch',
        date: new Date('2024-01-16'),
        mealType: 'Lunch',
        menu: 'Caesar salad, grilled chicken, croutons, lemonade',
        createdBy: adminUser._id
      },
      {
        title: 'Wednesday Breakfast',
        description: 'Quick and healthy breakfast',
        date: new Date('2024-01-17'),
        mealType: 'Breakfast',
        menu: 'Smoothie bowl, granola, banana, almond milk',
        createdBy: adminUser._id
      },
      {
        title: 'Wednesday Lunch',
        description: 'Italian-inspired lunch',
        date: new Date('2024-01-17'),
        mealType: 'Lunch',
        menu: 'Pasta carbonara, garlic bread, side salad',
        createdBy: adminUser._id
      },
      {
        title: 'Thursday Snack',
        description: 'Afternoon pick-me-up',
        date: new Date('2024-01-18'),
        mealType: 'Snack',
        menu: 'Mixed nuts, dried fruits, energy bar, water',
        createdBy: adminUser._id
      },
      {
        title: 'Friday Dinner',
        description: 'Weekend celebration meal',
        date: new Date('2024-01-19'),
        mealType: 'Dinner',
        menu: 'Pizza night, various toppings, garlic knots, soda',
        createdBy: adminUser._id
      }
    ];

    // Insert sample meals
    const createdMeals = await Meal.insertMany(sampleMeals);
    console.log(`Created ${createdMeals.length} sample meals`);

    console.log('Sample meals created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample meals:', error);
    process.exit(1);
  }
};

createSampleMeals();
