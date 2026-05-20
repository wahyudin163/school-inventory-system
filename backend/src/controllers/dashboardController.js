const { db } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total barang
    const totalItems = await db.one('SELECT COUNT(*) as count FROM items');

    // Total kategori
    const totalCategories = await db.one('SELECT COUNT(*) as count FROM categories');

    // Peminjaman aktif
    const activeBorrowings = await db.one(
      'SELECT COUNT(*) as count FROM borrowings WHERE status = $1',
      ['approved']
    );

    // Peminjaman terlambat
    const overdueBorrowings = await db.one(
      'SELECT COUNT(*) as count FROM borrowings WHERE status = $1 AND due_date < NOW()',
      ['approved']
    );

    // Barang kondisi rusak
    const damagedItems = await db.one(
      'SELECT COUNT(*) as count FROM items WHERE condition IN ($1, $2)',
      ['rusak_ringan', 'rusak_berat']
    );

    // Barang stok rendah
    const lowStockItems = await db.one(
      'SELECT COUNT(*) as count FROM items WHERE quantity <= min_stock'
    );

    // Total pengguna
    const totalUsers = await db.one('SELECT COUNT(*) as count FROM users');

    // Maintenance pending
    const pendingMaintenance = await db.one(
      'SELECT COUNT(*) as count FROM maintenance WHERE status = $1',
      ['pending']
    );

    sendSuccess(res, {
      totalItems: parseInt(totalItems.count),
      totalCategories: parseInt(totalCategories.count),
      activeBorrowings: parseInt(activeBorrowings.count),
      overdueBorrowings: parseInt(overdueBorrowings.count),
      damagedItems: parseInt(damagedItems.count),
      lowStockItems: parseInt(lowStockItems.count),
      totalUsers: parseInt(totalUsers.count),
      pendingMaintenance: parseInt(pendingMaintenance.count)
    });
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Items by Condition
const getItemsByCondition = async (req, res) => {
  try {
    const itemsByCondition = await db.any(
      `SELECT condition, COUNT(*) as count
       FROM items
       GROUP BY condition
       ORDER BY condition`
    );

    sendSuccess(res, itemsByCondition);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Borrowing Statistics
const getBorrowingStats = async (req, res) => {
  try {
    const stats = await db.one(
      `SELECT
        COUNT(*) as total_borrowings,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as active_borrowings,
        SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) as completed_borrowings,
        SUM(CASE WHEN status = 'approved' AND due_date < NOW() THEN 1 ELSE 0 END) as overdue_borrowings
       FROM borrowings`
    );

    sendSuccess(res, {
      total: parseInt(stats.total_borrowings) || 0,
      active: parseInt(stats.active_borrowings) || 0,
      completed: parseInt(stats.completed_borrowings) || 0,
      overdue: parseInt(stats.overdue_borrowings) || 0
    });
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Top Borrowed Items
const getTopBorrowedItems = async (req, res) => {
  try {
    const topItems = await db.any(
      `SELECT i.id, i.name, COUNT(b.id) as borrow_count
       FROM items i
       LEFT JOIN borrowings b ON i.id = b.item_id
       GROUP BY i.id, i.name
       ORDER BY borrow_count DESC
       LIMIT 10`
    );

    sendSuccess(res, topItems);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Recent Activities
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await db.any(
      `SELECT id, user_id, action, description, created_at FROM activities
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    sendSuccess(res, activities);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  getDashboardStats,
  getItemsByCondition,
  getBorrowingStats,
  getTopBorrowedItems,
  getRecentActivities
};
