const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAccessToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const validate = require('../validators/validate');
const {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/categoryValidators');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Tüm kategorileri listeler
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Başarılı kategori listesi döndü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Sunucu hatası
 * 
 *   post:
 *     summary: Yeni kategori oluşturur
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Kategori başarıyla oluşturuldu
 *       401:
 *         description: Yetkilendirme hatası (token eksik veya geçersiz)
 *       403:
 *         description: Erişim reddedildi (Admin yetkisi gerekli)
 *       400:
 *         description: Geçersiz veri gönderildi
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Kategori bilgilerini günceller
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek kategorinin benzersiz ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Kategori başarıyla güncellendi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Erişim reddedildi
 *       404:
 *         description: Kategori bulunamadı
 * 
 *   delete:
 *     summary: Kategori siler
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek kategorinin benzersiz ID'si
 *     responses:
 *       200:
 *         description: Kategori başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Erişim reddedildi
 *       404:
 *         description: Kategori bulunamadı
 */

router.post('/', 
  verifyAccessToken,
  authorizeRoles('admin'),
  createCategoryValidator,
  validate,
  categoryController.createCategory);

router.get('/', categoryController.getAllCategories);

router.put(
  '/:id',
  verifyAccessToken,
  authorizeRoles('admin'),
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  verifyAccessToken,
  authorizeRoles('admin'),
  categoryIdParamValidator,
  validate,
  categoryController.deleteCategory  
);

module.exports = router;
