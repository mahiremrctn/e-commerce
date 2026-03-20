const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri listeler
 *     description: Veritabanındaki tüm ürünleri kategorileriyle birlikte getirir.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı bir şekilde ürünler listelendi.
 *   post:
 *     summary: Yeni ürün oluşturur (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ürün başarıyla oluşturuldu.
 */
router.get('/', productController.getProducts);
router.post('/', protect, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Belirli bir ürünü getirir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ürün başarıyla getirildi.
 *   put:
 *     summary: Mevcut bir ürünü günceller (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek ürünün ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ürün başarıyla güncellendi.
 *   delete:
 *     summary: Belirli bir ürünü siler (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek ürünün ID'si
 *     responses:
 *       200:
 *         description: Ürün başarıyla silindi.
 *       401:
 *         description: Yetkisiz erişim - Token bulunamadı veya geçersiz.
 */
router.get('/:id', productController.getProductById);
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;