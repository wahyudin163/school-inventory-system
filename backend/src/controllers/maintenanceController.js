const { db } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Create Maintenance Record
const createMaintenance = async (req, res) => {
  try {
    const { item_id, description, status, scheduled_date } = req.body;
    const reported_by = req.user.id;

    const maintenance = await db.one(
      `INSERT INTO maintenance (item_id, description, status, scheduled_date, reported_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, item_id, description, status, scheduled_date`,
      [item_id, description, status || 'pending', scheduled_date, reported_by]
    );

    sendSuccess(res, maintenance, 'Laporan maintenance berhasil dibuat', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get All Maintenance Records
const getAllMaintenance = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT m.id, m.item_id, m.description, m.status, m.scheduled_date, m.completed_date,
             i.name as item_name, u.name as reported_by_name
      FROM maintenance m
      JOIN items i ON m.item_id = i.id
      JOIN users u ON m.reported_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND m.status = $1';
      params.push(status);
    }

    query += ` ORDER BY m.scheduled_date ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const maintenance = await db.any(query, params);
    const total = await db.one('SELECT COUNT(*) as count FROM maintenance');

    sendSuccess(res, {
      maintenance,
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

// Get Maintenance By ID
const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await db.oneOrNone(
      `SELECT m.id, m.item_id, m.description, m.status, m.scheduled_date, m.completed_date,
              i.name as item_name, u.name as reported_by_name
       FROM maintenance m
       JOIN items i ON m.item_id = i.id
       JOIN users u ON m.reported_by = u.id
       WHERE m.id = $1`,
      [id]
    );

    if (!maintenance) {
      return sendError(res, 'Data maintenance tidak ditemukan', 404);
    }

    sendSuccess(res, maintenance);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Update Maintenance
const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status, scheduled_date, completed_date } = req.body;

    const maintenance = await db.oneOrNone('SELECT id FROM maintenance WHERE id = $1', [id]);
    if (!maintenance) {
      return sendError(res, 'Data maintenance tidak ditemukan', 404);
    }

    const updated = await db.one(
      `UPDATE maintenance SET description = $1, status = $2, scheduled_date = $3, completed_date = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, description, status, scheduled_date, completed_date`,
      [description, status, scheduled_date, completed_date, id]
    );

    sendSuccess(res, updated, 'Maintenance berhasil diupdate');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Delete Maintenance
const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await db.oneOrNone('SELECT id FROM maintenance WHERE id = $1', [id]);
    if (!maintenance) {
      return sendError(res, 'Data maintenance tidak ditemukan', 404);
    }

    await db.none('DELETE FROM maintenance WHERE id = $1', [id]);
    sendSuccess(res, null, 'Maintenance berhasil dihapus');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance
};
