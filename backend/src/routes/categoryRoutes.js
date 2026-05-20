const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Read routes (semua role bisa akses)
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Write routes (hanya admin)
router.post('/', authorize('admin'), categoryController.createCategory);
router.put('/:id', authorize('admin'), categoryController.updateCategory);
router.delete('/:id', authorize('admin'), categoryController.deleteCategory);

module.exports = router;
