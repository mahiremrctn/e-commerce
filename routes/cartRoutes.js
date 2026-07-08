const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const validate = require('../validators/validate');
const { createWhatsAppCartValidator } = require('../validators/cartValidators');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItemInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 99
 *     WhatsAppCartInput:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItemInput'
 *         customerName:
 *           type: string
 *           maxLength: 80
 *         note:
 *           type: string
 *           maxLength: 300
 */

/**
 * @swagger
 * /api/cart/whatsapp:
 *   post:
 *     summary: Sepet icin WhatsApp siparis linki olusturur
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WhatsAppCartInput'
 *           example:
 *             items:
 *               - productId: 64f1b2c3d4e5f67890123456
 *                 quantity: 2
 *               - productId: 64f1b2c3d4e5f67890123457
 *                 quantity: 1
 *             customerName: Ayse Yilmaz
 *             note: Mumkunse hafta sonu teslim almak istiyorum.
 *     responses:
 *       200:
 *         description: WhatsApp linki basariyla olusturuldu
 *       404:
 *         description: Sepetteki urunlerden biri bulunamadi
 *       422:
 *         description: Validasyon hatasi
 */
router.post(
  '/whatsapp',
  createWhatsAppCartValidator,
  validate,
  cartController.createWhatsAppCartLink,
);

module.exports = router;
