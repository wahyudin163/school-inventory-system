const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateUser, validateRequest } = require('../utils/validators');

const router = express.Router();

// Public routes
router.post('/register', validateUser(), validateRequest, userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, authorize('admin', 'kepala_sekolah'), userController.updateUser);
router.delete('/:id', authenticateToken, authorize('admin'), userController.deleteUser);

module.exports = router;
