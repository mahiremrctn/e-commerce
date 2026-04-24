const Iyzipay = require('iyzipay');
const path = require('path');
const iyzipay = require('../config/iyzico');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { log } = require('console');

const getBaseUrl = () => {
  return (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
};

const getPaymentPagePath = (pageName) => {
    return path.join(__dirname, '..', 'views', pageName);
};

const retrieveCheckoutFormResult = (checkoutFormRequest) => {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutForm.retrieve(
            checkoutFormRequest,
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            },
        );
    });
};

const createCheckoutForm = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res
                .status(400)
                .json({ success: false, message: 'Ürün ID zorunludur' });
        }
        
        const product = await Product.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: 'Ürün bulunamadı' });
        }

        if (!product.inStock) {
            return res
                .status(400)
                .json({ success: false, message: 'Ürün stokta yok' });
        }

        const totalPrice = (product.price * quantity).toFixed(2);

        const order = await Order.create({
            user: userId,
            product: productId,
            quantity,
            totalPrice,
            paymentStatus: 'pending',
            paymentProvider: 'iyzico',
        });
