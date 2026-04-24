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