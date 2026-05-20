const { db } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { sendBorrowingReminder } = require('../utils/emailService');

// Create Borrowing
const createBorrowing = async (req, res) => {
  try {
    const { item_id, borrowed_by, quantity, due_date, notes } = req.body;
    const approved_by = req.user.id; // Dari token JWT

    // Cek stok item
    const item = await db.oneOrNone('SELECT id, quantity, name FROM items WHERE id = $1', [item_id]);
    if (!item) {
      return sendError(res, 'Barang tidak ditemukan', 404);
    }

    if (item.quantity < quantity) {
      return sendError(res, 'Stok barang tidak cukup', 400);
    }

    // Create borrowing record
    const borrowing = await db.one(
      `INSERT INTO borrowings (item_id, borrowed_by, quantity, due_date, approved_by, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, item_id, borrowed_by, quantity, due_date, status`,
      [item_id, borrowed_by, quantity, due_date, approved_by, 'approved', notes]
    );

    // Update stok barang
    await db.none('UPDATE items SET quantity = quantity - $1 WHERE id = $2', [quantity, item_id]);

    sendSuccess(res, borrowing, 'Peminjaman berhasil dibuat', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get All Borrowings
const getAllBorrowings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.id, b.item_id, b.borrowed_by, b.quantity, b.borrowed_date, b.due_date, b.returned_date, b.status, b.notes,
             i.name as item_name, u.name as borrower_name, u.email
      FROM borrowings b
      JOIN items i ON b.item_id = i.id
      JOIN users u ON b.borrowed_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND b.status = $1';
      params.push(status);
    }

    query += ` ORDER BY b.borrowed_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const borrowings = await db.any(query, params);
    const total = await db.one('SELECT COUNT(*) as count FROM borrowings');

    sendSuccess(res, {
      borrowings,
      pagination: {
        total: parseInt(total.count),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(parseInt(total.count) / limit)
      }
    });
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Borrowing By ID
const getBorrowingById = async (req, res) => {
  try {
    const { id } = req.params;
    const borrowing = await db.oneOrNone(
      `SELECT b.id, b.item_id, b.borrowed_by, b.quantity, b.borrowed_date, b.due_date, b.returned_date, b.status,
              i.name as item_name, u.name as borrower_name, u.email
       FROM borrowings b
       JOIN items i ON b.item_id = i.id
       JOIN users u ON b.borrowed_by = u.id
       WHERE b.id = $1`,
      [id]
    );

    if (!borrowing) {
      return sendError(res, 'Data peminjaman tidak ditemukan', 404);
    }

    sendSuccess(res, borrowing);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Return Borrowing
const returnBorrowing = async (req, res) => {
  try {
    const { id } = req.params;
    const { returned_quantity, condition } = req.body;

    const borrowing = await db.oneOrNone(
      'SELECT id, item_id, quantity, borrowed_by FROM borrowings WHERE id = $1 AND status = $2',
      [id, 'approved']
    );

    if (!borrowing) {
      return sendError(res, 'Peminjaman tidak ditemukan atau sudah dikembalikan', 404);
    }

    // Update borrowing status
    const updated = await db.one(
      `UPDATE borrowings SET status = $1, returned_date = NOW(), returned_quantity = $2, returned_condition = $3
       WHERE id = $4
       RETURNING id, status, returned_date`,
      ['returned', returned_quantity, condition, id]
    );

    // Update stok barang
    await db.none('UPDATE items SET quantity = quantity + $1 WHERE id = $2', [returned_quantity, borrowing.item_id]);

    sendSuccess(res, updated, 'Barang berhasil dikembalikan');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Overdue Borrowings
const getOverdueBorrowings = async (req, res) => {
  try {
    const overdue = await db.any(
      `SELECT b.id, b.item_id, b.borrowed_by, b.quantity, b.due_date, b.status,
              i.name as item_name, u.name as borrower_name, u.email,
              EXTRACT(DAY FROM NOW() - b.due_date) as days_overdue
       FROM borrowings b
       JOIN items i ON b.item_id = i.id
       JOIN users u ON b.borrowed_by = u.id
       WHERE b.status = 'approved' AND b.due_date < NOW()
       ORDER BY b.due_date ASC`
    );

    sendSuccess(res, overdue);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get User Borrowing History
const getUserBorrowingHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const borrowings = await db.any(
      `SELECT b.id, b.item_id, b.quantity, b.borrowed_date, b.due_date, b.returned_date, b.status,
              i.name as item_name
       FROM borrowings b
       JOIN items i ON b.item_id = i.id
       WHERE b.borrowed_by = $1
       ORDER BY b.borrowed_date DESC
       LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    const total = await db.one('SELECT COUNT(*) as count FROM borrowings WHERE borrowed_by = $1', [user_id]);

    sendSuccess(res, {
      borrowings,
      pagination: {
        total: parseInt(total.count),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(parseInt(total.count) / limit)
      }
    });
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  createBorrowing,
  getAllBorrowings,
  getBorrowingById,
  returnBorrowing,
  getOverdueBorrowings,
  getUserBorrowingHistory
};
