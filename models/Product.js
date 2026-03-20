  const mongoose = require('mongoose');

  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur'],
      trim: true
    },
    description: {
      type: String,
      required: true
    },
  price: {
          type: Number,
          required: true,
          min: 0 // Price cannot be negative / Fiyat negatif olamaz
      },
  image:{
    type: String,
    default: "https://via.placeholder.com/150"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, { timestamps: true });  // Automatically adds 'createdAt' / Otomatik olarak oluşturulma tarihi ekler

module.exports = mongoose.model('Product', productSchema);
