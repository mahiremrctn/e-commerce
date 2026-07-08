const { body } = require('express-validator');

const registerValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email zorunludur')
    .bail()
    .isEmail()
    .withMessage('Gecerli bir email gondermelisiniz')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Sifre zorunludur')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Sifre en az 6 karakter olmalidir'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role user veya admin olmalidir'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email zorunludur')
    .bail()
    .isEmail()
    .withMessage('Gecerli bir email gondermelisiniz')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Sifre zorunludur'),
];

const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token zorunludur')
    .isString()
    .withMessage('Refresh token metin olmalidir'),
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
};
