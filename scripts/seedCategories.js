require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/dbConfig');
const Category = require('../models/Category');

const categories = [
  { name: 'Electronics', description: 'Phones, laptops, and smart devices' },
  { name: 'Fashion', description: 'Clothing, shoes, and accessories' },
  { name: 'Home & Kitchen', description: 'Essentials for home and kitchen use' },
  { name: 'Beauty & Personal Care', description: 'Skin, hair, and personal care products' },
  { name: 'Sports & Outdoors', description: 'Fitness, camping, and outdoor gear' },
  { name: 'Books', description: 'Printed books and reading materials' },
  { name: 'Toys & Games', description: 'Toys, board games, and fun activities' },
  { name: 'Automotive', description: 'Car accessories and maintenance products' },
  { name: 'Office Supplies', description: 'Tools and stationery for office work' },
  { name: 'Pet Supplies', description: 'Food, care, and accessories for pets' },
  { name: 'Baby Products', description: 'Items for babies and new parents' },
  { name: 'Health', description: 'Health support and wellness products' },
  { name: 'Grocery', description: 'Food and daily grocery items' },
  { name: 'Garden', description: 'Garden tools and outdoor care items' },
  { name: 'Jewelry', description: 'Jewelry and decorative accessories' },
  { name: 'Music', description: 'Instruments and music-related items' },
  { name: 'Video Games', description: 'Consoles, games, and gaming accessories' },
  { name: 'Travel', description: 'Luggage and travel essentials' },
  { name: 'Art & Craft', description: 'Painting and handcraft materials' },
  { name: 'Industrial', description: 'Industrial and professional equipment' },
];

const seedCategories = async () => {
  try {
    await connectDB();

    const operations = categories.map((category) => ({
      updateOne: {
        filter: { name: category.name },
        update: { $set: category },
        upsert: true,
      },
    }));

    const result = await Category.bulkWrite(operations, { ordered: false });
    const totalCategories = await Category.countDocuments();

    console.log('Category seed completed.');
    console.log(`Upserted: ${result.upsertedCount || 0}`);
    console.log(`Modified: ${result.modifiedCount || 0}`);
    console.log(`Matched: ${result.matchedCount || 0}`);
    console.log(`Total categories: ${totalCategories}`);
  } catch (error) {
    console.error('Category seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
  }
};

seedCategories();