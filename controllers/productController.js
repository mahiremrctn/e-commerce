const Product = require('../models/Product');
const Category = require('../models/Category');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');

    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try{
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
    );

    if(!product) {
      return res 
      .status(404)
      .json({ success: false, message: 'Ürün bulunamadı' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try{
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Ürün bulunamadı' });
    }
    
    res.json({ success: true, message: 'Ürün silindi' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createNewProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProductByCategories = async (req, res) => {
  try{
    const rawCategories = req.query.categories;

    if(!rawCategories) {
      return res.status(400).json({
        success: false,
        message: 'Kategori parametresi zorunludur',
      });
    }

    const normalizedCategories = Array.isArray(rawCategories)
      ? rawCategories.join(',')
      : rawCategories;

    const categoryNames = [
      ... new Set(
        normalizedCategories
        .split(',')
        .map((category) => category.trim())
        .filter(Boolean),
      ),
    ];

    if(!categoryNames.length) {
      return res.status(400).json({
        success: false,
        message: 'Gecerli kategori listesi göndermelisiniz',
      });
    }

    const categories = await Category.find({ name: { $in: categoryNames } })
    .select('_id name')
    .lean();

    if(!categories.length) {
      return res.status(404).json({
        success: false,
        message: 'Verilen kategorilere ait sonuc bulunamadi',
      });
    }

    const categoryIds = categories.map((category) => category._id);
    
    const products = await Product.find({
      category: { $in: categoryIds },
    }).populate('category', 'name');

    res.json({
      success: true,
      count: products.length,
      categories: categories.map((category) => category.name),
      data: products,
    });
  } catch(error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductByCategories,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
    
