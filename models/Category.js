const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true, // No duplicate categories / Aynı isimde iki kategori olamaz
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Kategori aciklamasi en fazla 300 karakter olabilir'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
