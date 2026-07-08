const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyRefreshToken } = require('../middleware/auth');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} = require('../validators/authValidators');
const validate = require('../validators/validate');

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *     AuthLoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     AuthRefreshTokenInput:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AuthTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanici kaydi olusturur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterInput'
 *     responses:
 *       201:
 *         description: Kullanici basariyla olusturuldu
 *       400:
 *         description: Gecersiz veri veya email zaten kayitli
 */
router.post('/register', registerValidator, validate, authController.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanici girisi yapar ve token uretir
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginInput'
 *           example:
 *             email: test@mail.com
 *             password: test123
 *     responses:
 *       200:
 *         description: Giris basarili
 *       401:
 *         description: Email veya sifre hatali
 *       400:
 *         description: Gecersiz veri
 */
router.post('/login', loginValidator, validate, authController.loginUser);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh token ile yeni token cifti uretir
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRefreshTokenInput'
 *     responses:
 *       200:
 *         description: Yeni tokenler olusturuldu
 *       400:
 *         description: Refresh token eksik veya gecersiz istek
 *       401:
 *         description: Gecersiz kullanici veya token
 *       404:
 *         description: Kullanici bulunamadi
 */
router.post(
  '/refresh-token',
  refreshTokenValidator,
  validate,
  verifyRefreshToken,
  authController.refreshTokens,
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Refresh tokeni iptal ederek cikis yapar
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRefreshTokenInput'
 *     responses:
 *       200:
 *         description: Cikis basarili
 *       400:
 *         description: Refresh token eksik veya gecersiz istek
 */
router.post('/logout', refreshTokenValidator, validate, authController.logoutUser);

module.exports = router;
