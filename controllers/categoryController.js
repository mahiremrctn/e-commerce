const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch(error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCategories = async (req,res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
   } catch (error) {
    res.status(500).json({ message : error.message});
  }
};
