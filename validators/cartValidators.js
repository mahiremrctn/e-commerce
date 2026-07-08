const { body } = require('express-validator');

const createWhatsAppCartValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Sepette en az bir urun olmalidir'),

  body('items.*.productId')
    .notEmpty()
    .withMessage('Urun id zorunludur')
    .bail()
    .isMongoId()
    .withMessage('Urun id gecersiz formatta'),

  body('items.*.quantity')
    .exists({ checkNull: true })
    .withMessage('Adet zorunludur')
    .bail()
    .isInt({ min: 1, max: 99 })
    .withMessage('Adet 1 ile 99 arasinda bir tam sayi olmalidir'),

  body('customerName')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Musteri adi en fazla 80 karakter olabilir'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Not en fazla 300 karakter olabilir'),
];

module.exports = {
  createWhatsAppCartValidator,
};
