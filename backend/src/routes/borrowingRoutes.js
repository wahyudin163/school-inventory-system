const express = require('express');
const borrowingController = require('../controllers/borrowingController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateRequest, validateBorrowing } = require('../utils/validators');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Read routes
router.get('/', borrowingController.getAllBorrowings);
router.get('/:id', borrowingController.getBorrowingById);
router.get('/overdue/list', borrowingController.getOverdueBorrowings);
router.get('/user/:user_id', borrowingController.getUserBorrowingHistory);

// Write routes (hanya admin, kepala_sekolah, dan staff)
router.post('/', authorize('admin', 'kepala_sekolah', 'staff'), validateBorrowing(), validateRequest, borrowingController.createBorrowing);
router.put('/:id/return', authorize('admin', 'kepala_sekolah', 'staff'), borrowingController.returnBorrowing);

module.exports = router;
