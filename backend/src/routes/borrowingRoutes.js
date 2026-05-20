const express = require('express');
const borrowingController = require('../controllers/borrowingController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateBorrowing, validateRequest } = require('../utils/validators');

const router = express.Router();

// Get all borrowings
router.get('/', authenticateToken, borrowingController.getAllBorrowings);

// Get borrowing by ID
router.get('/:id', authenticateToken, borrowingController.getBorrowingById);

// Get overdue borrowings
router.get('/overdue/list', authenticateToken, authorize('admin', 'staff'), borrowingController.getOverdueBorrowings);

// Get user borrowing history
router.get('/history/:user_id', authenticateToken, borrowingController.getUserBorrowingHistory);

// Create borrowing
router.post('/',
  authenticateToken,
  validateBorrowing(),
  validateRequest,
  borrowingController.createBorrowing
);

// Return borrowing
router.post('/:id/return', authenticateToken, borrowingController.returnBorrowing);

module.exports = router;
