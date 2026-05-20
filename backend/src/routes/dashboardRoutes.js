const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Dashboard statistics (hanya admin dan kepala_sekolah)
router.get('/stats', authorize('admin', 'kepala_sekolah'), dashboardController.getDashboardStats);
router.get('/items/condition', authorize('admin', 'kepala_sekolah'), dashboardController.getItemsByCondition);
router.get('/borrowing/stats', authorize('admin', 'kepala_sekolah'), dashboardController.getBorrowingStats);
router.get('/items/top-borrowed', authorize('admin', 'kepala_sekolah'), dashboardController.getTopBorrowedItems);
router.get('/activities/recent', authorize('admin', 'kepala_sekolah'), dashboardController.getRecentActivities);

module.exports = router;
