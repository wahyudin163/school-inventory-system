const { db } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await db.one(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description',
      [name, description]
    );

    sendSuccess(res, category, 'Kategori berhasil ditambahkan', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await db.any('SELECT id, name, description, created_at FROM categories ORDER BY name ASC');
    sendSuccess(res, categories);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Category By ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.oneOrNone('SELECT id, name, description FROM categories WHERE id = $1', [id]);

    if (!category) {
      return sendError(res, 'Kategori tidak ditemukan', 404);
    }

    sendSuccess(res, category);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await db.oneOrNone('SELECT id FROM categories WHERE id = $1', [id]);
    if (!category) {
      return sendError(res, 'Kategori tidak ditemukan', 404);
    }

    const updated = await db.one(
      'UPDATE categories SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, description',
      [name, description, id]
    );

    sendSuccess(res, updated, 'Kategori berhasil diupdate');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await db.oneOrNone('SELECT id FROM categories WHERE id = $1', [id]);
    if (!category) {
      return sendError(res, 'Kategori tidak ditemukan', 404);
    }

    // Cek apakah ada items yang menggunakan kategori ini
    const itemCount = await db.one('SELECT COUNT(*) as count FROM items WHERE category_id = $1', [id]);
    if (parseInt(itemCount.count) > 0) {
      return sendError(res, 'Kategori tidak bisa dihapus karena masih ada barang', 400);
    }

    await db.none('DELETE FROM categories WHERE id = $1', [id]);
    sendSuccess(res, null, 'Kategori berhasil dihapus');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
