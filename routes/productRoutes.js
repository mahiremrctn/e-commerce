const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const validate = require("../validators/validate");
const {
  createProductValidator,
  productIdParamValidator,
  getProductsByCategoriesValidator,
  updateProductValidator,
} = require("../validators/productValidators");
const { verifyAccessToken } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roles");

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
 *         image:
 *           type: string
 *           format: uri
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *         - description
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
 *           maxLength: 500
 *         image:
 *           type: string
 *           format: uri
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
 *           maxLength: 500
 *         image:
 *           type: string
 *           format: uri
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tum urunleri listeler, filtreler ve sayfalama destekler
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Sayfa numarasi (varsayilan 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Sayfa basina urun sayisi (varsayilan 10)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum fiyat filtresi
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maksimum fiyat filtresi
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc]
 *         description: Siralama secenegi
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategori ID sine gore filtrele
 *     responses:
 *       200:
 *         description: Basarili urun listesi
 *       400:
 *         description: Gecersiz parametre
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
 *   get:
 *     summary: Tekil urun detayini goruntuler (Musteriler icin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Urunun benzersiz ID degeri
 *     responses:
 *       200:
 *         description: Urun detayı basariyla getirildi
 *       404:
 *         description: Urun bulunamadi
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
router.get("/", productController.getProducts);

router.get(
  "/by-categories",
  getProductsByCategoriesValidator,
  validate,
  productController.getProductsByCategories,
);

router.get(
  "/:productId",
  productIdParamValidator,
  validate,
  productController.getProductById,
);

router.post(
  "/",
  verifyAccessToken,
  authorizeRoles("admin"),
  createProductValidator,
  validate,
  productController.createNewProduct,
);

router.put(
  "/:productId",
  verifyAccessToken,
  authorizeRoles("admin"),
  updateProductValidator,
  validate,
  productController.updateProduct,
);

router.delete(
  "/:productId",
  verifyAccessToken,
  authorizeRoles("admin"),
  productIdParamValidator,
  validate,
  productController.deleteProduct,
);

module.exports = router;
