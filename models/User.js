const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email zorunludur!'], // Validasyon
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, 'Parola zorunludur!'],
      minlength: [6, 'Parola en az 6 karakter olmalidir!'],
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
  },
);

module.exports = mongoose.model('User', userSchema); 
