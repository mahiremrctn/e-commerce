const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.use(verifyAccessToken, authorizeRoles('admin'));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
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
 *     UserCreateInput:
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
 *     UserUpdateInput:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
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
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tum kullanicilari listeler
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Basarili kullanici listesi
 *       400:
 *         description: Kullanici listesi getirilemedi
 *   post:
 *     summary: Yeni kullanici kaydi ekler
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateInput'
 *     responses:
 *       201:
 *         description: Kullanici basariyla olusturuldu
 *       400:
 *         description: Gecersiz veri veya email zaten kayitli
 *   put:
 *     summary: Kullanici bilgilerini gunceller
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: Kullanici basariyla guncellendi
 *       400:
 *         description: Gecersiz veri veya userId eksik
 *       404:
 *         description: Kullanici bulunamadi
 */
router.get('/', userController.getAllUsers);
router.post('/', userController.createNewUser);
router.put('/', userController.updateUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Kullaniciyi siler
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kullanici basariyla silindi
 *       400:
 *         description: Gecersiz userId
 *       404:
 *         description: Kullanici bulunamadi
 */
router.delete('/:userId', userController.deleteUser);

module.exports = router;
