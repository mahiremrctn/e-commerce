const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try{
    const products = await Product.find().populate('category');
    res.status(200).json(products);
   } catch(error) {
    res.status(500).json({ message: error.message });
   }

  };
exports.createProduct = async (req, res) => {
  try{
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message});
  }
};

// Update a product
exports.updateProduct = async(req, res) => {
  try{
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Ürün Bulunamadı'});
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete a product
exports.deleteProduct = async(req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) return res.status(404).json({ message: 'Ürün bulunamadı'});
    res.status(200).json({ message: 'Ürün başarıyla silindi'});
  } catch(error) {
    res.status(500).json({ message: error.message});
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};