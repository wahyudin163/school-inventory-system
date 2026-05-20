const express = require('express');
const itemController = require('../controllers/itemController');
const { authenticateToken, authorize } = require('../middleware/auth');
const upload = require('../utils/fileHandler');
const { validateRequest, validateItem } = require('../utils/validators');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Read routes (semua role bisa akses)
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.get('/category/:category_id', itemController.getItemsByCategory);

// Write routes (hanya admin dan staff)
router.post('/', authorize('admin', 'staff'), upload.single('photo'), validateItem(), validateRequest, itemController.createItem);
router.put('/:id', authorize('admin', 'staff'), upload.single('photo'), itemController.updateItem);
router.delete('/:id', authorize('admin', 'staff'), itemController.deleteItem);

module.exports = router;
