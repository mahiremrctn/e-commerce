const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validate = require('../validators/validate');
const {
  createProductValidator,
  productIdParamValidator,
  getProductsByCategoriesValidator,
  updateProductValidator,
} = require('../validators/productValidators');
const { verifyAccessToken } = require('../middleware/auth');
const {authorizeRoles } = require('../middleware/roles');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         inStock:
 *           type: boolean
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 120
 *         price:
 *           type: number
 *           minimum: 0
 *         category:
 *           type: string
 *         description:
 *           type: string
 *           maxLength: 100
 *         inStock:
 *           type: boolean
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     ProductUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 120
 *         price:
 *           type: number
 *           minimum: 0
 *         category:
 *           type: string
 *         description:
 *           type: string
 *           maxLength: 100
 *         inStock:
 *           type: boolean
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tum urunleri listeler
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Basarili urun listesi
 *       401:
 *         description: Yetkilendirme hatasi (token yok/gecersiz)
 *       403:
 *         description: Rol yetkisi yetersiz
 *   post:
 *     summary: Yeni urun olusturur
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Urun basariyla olusturuldu
 *       400:
 *         description: Validasyon hatasi veya gecersiz veri
 *       401:
 *         description: Yetkilendirme hatasi (token yok/gecersiz)
 *       403:
 *         description: Rol yetkisi yetersiz
 */

/**
 * @swagger
 * /api/products/by-categories:
 *   get:
 *     summary: Kategori adlarina gore urunleri listeler
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categories
 *         required: true
 *         schema:
 *           type: string
 *         description: Virgulle ayrilmis kategori adlari (ornek Elektronik,Giyim)
 *     responses:
 *       200:
 *         description: Kategorilere gore urun listesi
 *       400:
 *         description: categories parametresi eksik/gecersiz
 *       404:
 *         description: Verilen kategoriler icin sonuc bulunamadi
 */

/**
 * @swagger
 * /api/products/{productId}:
 *   put:
 *     summary: Urun bilgilerini gunceller
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Urun basariyla guncellendi
 *       400:
 *         description: Validasyon hatasi veya gecersiz veri
 *       401:
 *         description: Yetkilendirme hatasi (token yok/gecersiz)
 *       403:
 *         description: Rol yetkisi yetersiz
 *       404:
 *         description: Urun bulunamadi
 *   delete:
 *     summary: Urunu siler
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Urun basariyla silindi
 *       400:
 *         description: Gecersiz productId
 *       401:
 *         description: Yetkilendirme hatasi (token yok/gecersiz)
 *       403:
 *         description: Rol yetkisi yetersiz
 *       404:
 *         description: Urun bulunamadi
 */
router.get(
  '/',
  verifyAccessToken,
  authorizeRoles('admin'),
  productController.getAllProducts,
);

router.get(
  '/by-categories',
  verifyAccessToken,
  authorizeRoles('admin'),
  getProductsByCategoriesValidator,
  validate,
  productController.getProductsByCategories,
);

router.post(
  '/',
  verifyAccessToken,
  authorizeRoles('admin'),
  createProductValidator,
  validate,
  productController.createNewProduct,
);

router.put(
  '/:productId',
  verifyAccessToken,
  authorizeRoles('admin'),
  updateProductValidator,
  validate,
  productController.updateProduct,
);

router.delete(
  '/:productId',
  verifyAccessToken,
  authorizeRoles('admin'),
  productIdParamValidator,
  validate,
  productController.deleteProduct,
);

module.exports = router;