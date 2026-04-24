const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/auth');
const {
  createCheckoutForm,
  handleCheckoutCallback,
  getPaymentSuccessPage,
  getPaymentFailurePage,
} = require('../controllers/iyzicoPaymentController');

/**
 * @swagger
 * /api/iyzico-payments/checkout:
 *   post:
 *     summary: iyzico ödeme sayfası oluşturur
 *     tags: [Iyzico Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Satın alınacak ürün ID'si
 *               quantity:
 *                 type: number
 *                 default: 1
 *                 description: Ürün adedi
 *     responses:
 *       200:
 *         description: Ödeme formu başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek
 *       404:
 *         description: Ürün bulunamadı
 */
router.post('/checkout', verifyAccessToken, createCheckoutForm);
router.post('/callback', handleCheckoutCallback);
router.get('/success', getPaymentSuccessPage);
router.get('/failure', getPaymentFailurePage);

module.exports = router;