const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAccessToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.post('/', categoryController.createCategory);

router.get('/', categoryController.getAllCategories);

router.put(
  '/:id',
  verifyAccessToken,
  authorizeRoles('admin'),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  verifyAccessToken,
  authorizeRoles('admin'),
  categoryController.deleteCategory  
);

module.exports = router;