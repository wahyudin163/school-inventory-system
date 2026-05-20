const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, dashboardController.getDashboardStats);

// Get items by condition
router.get('/items-condition', authenticateToken, dashboardController.getItemsByCondition);

// Get borrowing statistics
router.get('/borrowing-stats', authenticateToken, dashboardController.getBorrowingStats);

// Get top borrowed items
router.get('/top-borrowed', authenticateToken, dashboardController.getTopBorrowedItems);

// Get recent activities
router.get('/activities', authenticateToken, dashboardController.getRecentActivities);

module.exports = router;
