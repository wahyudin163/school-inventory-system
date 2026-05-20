const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateRequest, validateUser } = require('../utils/validators');

const router = express.Router();

// Auth routes (tidak perlu autentikasi)
router.post('/register', validateUser(), validateRequest, userController.register);
router.post('/login', userController.login);

// Protected routes (perlu autentikasi)
router.get('/', authenticateToken, authorize('admin', 'kepala_sekolah'), userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, authorize('admin'), userController.updateUser);
router.delete('/:id', authenticateToken, authorize('admin'), userController.deleteUser);

module.exports = router;
