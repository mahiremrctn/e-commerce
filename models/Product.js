const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı zorunludur'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması zorunludur'],
    trim: true,
    maxlength: [500, 'Ürün açıklaması en fazla 500 karakter olabilir'],
  },
  price: {
    type: Number,
    required: [true, 'Ürün fiyatı zorunludur'],
    min: [0, 'Fiyat negatif olamaz'],
  },
  oldPrice: {
    type: Number,
    min: [0, 'Eski fiyat negatif olamaz'],
  },
  discountPrice: {
    type: Number,
    min: [0, 'Indirimli fiyat negatif olamaz'],
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150',
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori zorunludur'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
