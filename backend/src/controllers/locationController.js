const { db } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Create Location
const createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;

    const location = await db.one(
      'INSERT INTO locations (name, description) VALUES ($1, $2) RETURNING id, name, description',
      [name, description]
    );

    sendSuccess(res, location, 'Lokasi berhasil ditambahkan', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get All Locations
const getAllLocations = async (req, res) => {
  try {
    const locations = await db.any('SELECT id, name, description, created_at FROM locations ORDER BY name ASC');
    sendSuccess(res, locations);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get Location By ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await db.oneOrNone('SELECT id, name, description FROM locations WHERE id = $1', [id]);

    if (!location) {
      return sendError(res, 'Lokasi tidak ditemukan', 404);
    }

    sendSuccess(res, location);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Update Location
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const location = await db.oneOrNone('SELECT id FROM locations WHERE id = $1', [id]);
    if (!location) {
      return sendError(res, 'Lokasi tidak ditemukan', 404);
    }

    const updated = await db.one(
      'UPDATE locations SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, description',
      [name, description, id]
    );

    sendSuccess(res, updated, 'Lokasi berhasil diupdate');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Delete Location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await db.oneOrNone('SELECT id FROM locations WHERE id = $1', [id]);
    if (!location) {
      return sendError(res, 'Lokasi tidak ditemukan', 404);
    }

    // Cek apakah ada items yang menggunakan lokasi ini
    const itemCount = await db.one('SELECT COUNT(*) as count FROM items WHERE location_id = $1', [id]);
    if (parseInt(itemCount.count) > 0) {
      return sendError(res, 'Lokasi tidak bisa dihapus karena masih ada barang', 400);
    }

    await db.none('DELETE FROM locations WHERE id = $1', [id]);
    sendSuccess(res, null, 'Lokasi berhasil dihapus');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};
