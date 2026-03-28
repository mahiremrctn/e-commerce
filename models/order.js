const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.types.ObjectId,
      ref: 'User',
      required: [true, 'Kullanici bilgisi zorunludur'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Ürün bilgisi zorunludur'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Miktar en az 1 olmalidir'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Toplam fiyat negatif olamaz'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failure'],
      default: 'pending',
    },
    iyzicoToken: {
      type: String,
    },
    iyzicoPaymentId: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    stripePaymentIntentId: {
      type: String,
    },
    paymentProvider: {
      type: String,
      enum: ['iyzico', 'stripe'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Order', orderSchema);