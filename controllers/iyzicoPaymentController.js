const Iyzipay = require('iyzipay');
const path = require('path');
const iyzipay = require('../config/iyzico');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { log } = require('console');

getBaseUrl = () => {
  return (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
};