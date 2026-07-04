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

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
   } catch (error) {
    res.status(500).json({ message : error.message});
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.status(200).json({ message: 'Kategori güncellendi', category: updatedCategory });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if(!deletedCategory){return res.status(404).json({ message: 'Silinmek istenen kategori bulunamadı!'});   
  }
    res.status(200).json({
      message: 'Kategori başarıyla silindi.',
      id: deletedCategory._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
