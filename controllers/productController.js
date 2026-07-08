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
      { new: true, runValidators: true },
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

const getProductsByCategories = async (req, res) => {
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

const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, minPrice, maxPrice, sortBy } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sıralama ayarı (Örn: sortBy=price_asc veya price_desc)
    let sortOptions = {};
    if (sortBy === 'price_asc') sortOptions.price = 1;
    if (sortBy === 'price_desc') sortOptions.price = -1;

    const products = await Product.find(query)
      .populate('category', 'name description') // Sadece kategori ID'si değil, ismi de gelir
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total: totalProducts,
        page,
        pages: Math.ceil(totalProducts / limit)
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Ürün getirme hatası:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategories,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getProducts,
};
    
