const { body, param } = require('express-validator');

const categoryIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Kategori id gecersiz formatta'),
];

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Kategori adi zorunludur'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Kategori aciklamasi en fazla 300 karakter olabilir'),
];

const updateCategoryValidator = [
  ...categoryIdParamValidator,

  body()
    .custom((_, { req }) => {
      const allowedFields = ['name', 'description'];
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
    .withMessage('Kategori adi bos olamaz'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Kategori aciklamasi en fazla 300 karakter olabilir'),
];

module.exports = {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
};
