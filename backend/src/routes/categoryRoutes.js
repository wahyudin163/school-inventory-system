const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', authenticateToken, categoryController.getAllCategories);

// Get category by ID
router.get('/:id', authenticateToken, categoryController.getCategoryById);

// Create category
router.post('/', authenticateToken, authorize('admin', 'staff'), categoryController.createCategory);

// Update category
router.put('/:id', authenticateToken, authorize('admin', 'staff'), categoryController.updateCategory);

// Delete category
router.delete('/:id', authenticateToken, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
