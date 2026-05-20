const { db } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { generateBarcode } = require('../utils/generateBarcode');

// Create Item
const createItem = async (req, res) => {
  try {
    const { name, description, category_id, location_id, supplier_id, quantity, unit, condition, min_stock } = req.body;
    const photo = req.file ? `/uploads/${req.body.type || 'items'}/${req.file.filename}` : null;

    const item = await db.one(
      `INSERT INTO items (name, description, category_id, location_id, supplier_id, quantity, unit, condition, min_stock, photo, barcode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, description, category_id, location_id, quantity, unit, condition, photo`,
      [name, description, category_id, location_id, supplier_id, quantity, unit, condition, min_stock, photo, `ITEM-${Date.now()}`]
    );

    // Generate barcode
    const barcodePath = await generateBarcode(item.id, name);
    await db.none('UPDATE items SET barcode = $1 WHERE id = $2', [barcodePath, item.id]);

    sendSuccess(res, { ...item, barcode: barcodePath }, 'Barang berhasil ditambahkan', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get All Items
const getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, category_id, condition } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT i.id, i.name, i.description, i.category_id, i.location_id, i.quantity, i.unit, i.condition, i.photo, i.barcode, i.min_stock,
             c.name as category_name, l.name as location_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN locations l ON i.location_id = l.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (category_id) {
      query += ` AND i.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }

    if (condition) {
      query += ` AND i.condition = $${paramIndex}`;
      params.push(condition);
      paramIndex++;
    }

    query += ` ORDER BY i.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const items = await db.any(query, params);
    const total = await db.one('SELECT COUNT(*) as count FROM items');

    sendSuccess(res, {
      items,
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

// Get Item By ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.oneOrNone(
      `SELECT i.id, i.name, i.description, i.category_id, i.location_id, i.quantity, i.unit, i.condition, i.photo, i.barcode, i.min_stock,
              c.name as category_name, l.name as location_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       LEFT JOIN locations l ON i.location_id = l.id
       WHERE i.id = $1`,
      [id]
    );

    if (!item) {
      return sendError(res, 'Barang tidak ditemukan', 404);
    }

    sendSuccess(res, item);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Update Item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, location_id, quantity, unit, condition, min_stock } = req.body;
    const photo = req.file ? `/uploads/items/${req.file.filename}` : undefined;

    const item = await db.oneOrNone('SELECT id FROM items WHERE id = $1', [id]);
    if (!item) {
      return sendError(res, 'Barang tidak ditemukan', 404);
    }

    let query = `UPDATE items SET name = $1, description = $2, category_id = $3, location_id = $4, quantity = $5, unit = $6, condition = $7, min_stock = $8, updated_at = NOW()`;
    const params = [name, description, category_id, location_id, quantity, unit, condition, min_stock];

    if (photo) {
      query += `, photo = $9`;
      params.push(photo);
      query += ` WHERE id = $10`;
      params.push(id);
    } else {
      query += ` WHERE id = $9`;
      params.push(id);
    }

    const updated = await db.one(query + ' RETURNING id, name, description, category_id, location_id, quantity, condition', params);
    sendSuccess(res, updated, 'Barang berhasil diupdate');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Delete Item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.oneOrNone('SELECT id FROM items WHERE id = $1', [id]);
    if (!item) {
      return sendError(res, 'Barang tidak ditemukan', 404);
    }

    await db.none('DELETE FROM items WHERE id = $1', [id]);
    sendSuccess(res, null, 'Barang berhasil dihapus');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Items by Category
const getItemsByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const items = await db.any(
      `SELECT i.id, i.name, i.quantity, i.condition, c.name as category_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       WHERE i.category_id = $1
       ORDER BY i.name ASC`,
      [category_id]
    );

    sendSuccess(res, items);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getItemsByCategory
};
