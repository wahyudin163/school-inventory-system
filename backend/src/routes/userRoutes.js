const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateUser, validateRequest } = require('../utils/validators');

// Public routes
router.post('/register', validateUser(), validateRequest, userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/', authenticateToken, authorize('admin', 'kepala_sekolah'), userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, authorize('admin', 'kepala_sekolah'), userController.updateUser);
router.delete('/:id', authenticateToken, authorize('admin'), userController.deleteUser);

module.exports = router;
