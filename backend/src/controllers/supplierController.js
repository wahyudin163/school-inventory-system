const { db } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Create Supplier
const createSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address } = req.body;

    const supplier = await db.one(
      `INSERT INTO suppliers (name, contact, email, phone, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, contact, email, phone, address`,
      [name, contact, email, phone, address]
    );

    sendSuccess(res, supplier, 'Supplier berhasil ditambahkan', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get All Suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const suppliers = await db.any(
      'SELECT id, name, contact, email, phone, address, created_at FROM suppliers ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const total = await db.one('SELECT COUNT(*) as count FROM suppliers');

    sendSuccess(res, {
      suppliers,
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

// Get Supplier By ID
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await db.oneOrNone(
      'SELECT id, name, contact, email, phone, address FROM suppliers WHERE id = $1',
      [id]
    );

    if (!supplier) {
      return sendError(res, 'Supplier tidak ditemukan', 404);
    }

    sendSuccess(res, supplier);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Update Supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, phone, address } = req.body;

    const supplier = await db.oneOrNone('SELECT id FROM suppliers WHERE id = $1', [id]);
    if (!supplier) {
      return sendError(res, 'Supplier tidak ditemukan', 404);
    }

    const updated = await db.one(
      `UPDATE suppliers SET name = $1, contact = $2, email = $3, phone = $4, address = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, contact, email, phone, address`,
      [name, contact, email, phone, address, id]
    );

    sendSuccess(res, updated, 'Supplier berhasil diupdate');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Delete Supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await db.oneOrNone('SELECT id FROM suppliers WHERE id = $1', [id]);
    if (!supplier) {
      return sendError(res, 'Supplier tidak ditemukan', 404);
    }

    await db.none('DELETE FROM suppliers WHERE id = $1', [id]);
    sendSuccess(res, null, 'Supplier berhasil dihapus');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
};
