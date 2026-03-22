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
    .isFloat({ min: 0 })
    .withMessage('Fiyat 0 veya daha buyuk bir sayi olmalidir'),

  body('category')
    .exists({ checkNull: true })
    .withMessage('Kategori zorunludur')
    .bail()
    .isMongoId()
    .withMessage('Kategori gecersiz formatta')
    .bail()
    .custom(validateCategoryExists),

  body('description')
    .optional()
    .isString()
    .withMessage('Aciklama metin olmalidir')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Aciklama en fazla 100 karakter olabilir'),

  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock alani boolean olmalidir'),

  body('tags').optional().isArray().withMessage('tags alani dizi olmalidir'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('tags icindeki tum degerler metin olmalidir'),
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
      const allowedFields = ['name', 'price', 'category', 'description', 'inStock', 'tags'];
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
    .isFloat({ min: 0 })
    .withMessage('Fiyat 0 veya daha buyuk bir sayi olmalidir'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Kategori gecersiz formatta')
    .bail()
    .custom(validateCategoryExists),

  body('description')
    .optional()
    .isString()
    .withMessage('Aciklama metin olmalidir')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Aciklama en fazla 100 karakter olabilir'),

  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock alani boolean olmalidir'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('tags alani dizi olmalidir'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('tags icindeki tum degerler metin olmalidir'),
];

module.exports = {
  createProductValidator,
  productIdParamValidator,
  getProductsByCategoriesValidator,
  updateProductValidator,
};