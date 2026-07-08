const { body, param, query } = require('express-validator');
const Category = require('../models/Category');

const validateCategoryExists = async (categoryId) => {
  const category = await Category.findById(categoryId).select('_id').lean();

  if (!category) {
    throw new Error('Kategori bulunamadi');
  }

  return true;
};

const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Urun adi zorunludur')
    .isLength({ max: 120 })
    .withMessage('Urun adi en fazla 120 karakter olabilir'),

  body('price')
    .exists({ checkNull: true })
    .withMessage('Fiyat zorunludur')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Fiyat 0dan buyuk bir sayi olmalidir'),

  body('category')
    .exists({ checkNull: true })
    .withMessage('Kategori zorunludur')
    .bail()
    .isMongoId()
    .withMessage('Kategori gecersiz formatta')
    .bail()
    .custom(validateCategoryExists),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Aciklama zorunludur')
    .bail()
    .isString()
    .withMessage('Aciklama metin olmalidir')
    .bail()
    .isLength({ max: 500 })
    .withMessage('Aciklama en fazla 500 karakter olabilir'),

  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Gorsel alani gecerli bir URL olmalidir'),
];

const productIdParamValidator = [
  param('productId')
    .isMongoId()
    .withMessage('productId gecersiz formatta'),
];

const getProductsByCategoriesValidator = [
  query('categories')
    .exists({ checkFalsy: true })
    .withMessage('categories query parametresi zorunludur')
    .bail()
    .custom((value) => {
      const normalized = Array.isArray(value) ? value.join(',') : value;

      if (typeof normalized !== 'string') {
        throw new Error('categories parametresi metin olmalidir');
      }

      const categoryNames = normalized
        .split(',')
        .map((category) => category.trim())
        .filter(Boolean);

      if (!categoryNames.length) {
        throw new Error('En az bir kategori gondermelisiniz');
      }

      return true;
    }),
];

const updateProductValidator = [
  ...productIdParamValidator,

  body()
    .custom((_, { req }) => {
      const allowedFields = ['name', 'price', 'category', 'description', 'image'];
      const payloadKeys = Object.keys(req.body || {});

      if (!payloadKeys.length) {
        throw new Error('Guncellenecek en az bir alan gondermelisiniz');
      }

      const hasInvalidField = payloadKeys.some((key) => !allowedFields.includes(key));

      if (hasInvalidField) {
        throw new Error('Gecersiz alan gonderdiniz');
      }

      return true;
    }),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Urun adi bos olamaz')
    .isLength({ max: 120 })
    .withMessage('Urun adi en fazla 120 karakter olabilir'),

  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Fiyat 0dan buyuk bir sayi olmalidir'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Kategori gecersiz formatta')
    .bail()
    .custom(validateCategoryExists),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Aciklama bos olamaz')
    .bail()
    .isString()
    .withMessage('Aciklama metin olmalidir')
    .bail()
    .isLength({ max: 500 })
    .withMessage('Aciklama en fazla 500 karakter olabilir'),

  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Gorsel alani gecerli bir URL olmalidir'),
];

module.exports = {
  createProductValidator,
  productIdParamValidator,
  getProductsByCategoriesValidator,
  updateProductValidator,
};
