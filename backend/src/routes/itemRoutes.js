const express = require('express');
const itemController = require('../controllers/itemController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateItem, validateRequest } = require('../utils/validators');
const upload = require('../utils/fileHandler');

const router = express.Router();

// Get all items
router.get('/', authenticateToken, itemController.getAllItems);

// Get item by ID
router.get('/:id', authenticateToken, itemController.getItemById);

// Get items by category
router.get('/category/:category_id', authenticateToken, itemController.getItemsByCategory);

// Create item
router.post('/',
  authenticateToken,
  authorize('admin', 'staff'),
  upload.single('photo'),
  validateItem(),
  validateRequest,
  itemController.createItem
);

// Update item
router.put('/:id',
  authenticateToken,
  authorize('admin', 'staff'),
  upload.single('photo'),
  itemController.updateItem
);

// Delete item
router.delete('/:id', authenticateToken, authorize('admin'), itemController.deleteItem);

module.exports = router;
