const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', authenticateToken, authorize('admin', 'kepala_sekolah'), dashboardController.getDashboardStats);

// Get items by condition
router.get('/items/condition', authenticateToken, dashboardController.getItemsByCondition);

// Get borrowing statistics
router.get('/borrowing/stats', authenticateToken, dashboardController.getBorrowingStats);

// Get top borrowed items
router.get('/borrowing/top-items', authenticateToken, dashboardController.getTopBorrowedItems);

// Get recent activities
router.get('/activities/recent', authenticateToken, dashboardController.getRecentActivities);

module.exports = router;
