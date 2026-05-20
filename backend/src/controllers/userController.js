const { db } = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Cek user sudah ada
    const existingUser = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser) {
      return sendError(res, 'Email sudah terdaftar', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const user = await db.one(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role || 'staff']
    );

    sendSuccess(res, user, 'User berhasil didaftarkan', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.oneOrNone('SELECT id, name, email, password, role FROM users WHERE email = $1', [email]);
    if (!user) {
      return sendError(res, 'Email atau password salah', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Email atau password salah', 401);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, 'Login berhasil');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, role, created_at FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const users = await db.any(query, params);
    const total = await db.one('SELECT COUNT(*) as count FROM users');

    sendSuccess(res, {
      users,
      pagination: {
        total: parseInt(total.count),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(parseInt(total.count) / limit)
      }
    }, 'Data users berhasil diambil');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get User By ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.oneOrNone('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);

    if (!user) {
      return sendError(res, 'User tidak ditemukan', 404);
    }

    sendSuccess(res, user, 'Data user berhasil diambil');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await db.oneOrNone('SELECT id FROM users WHERE id = $1', [id]);
    if (!user) {
      return sendError(res, 'User tidak ditemukan', 404);
    }

    const updated = await db.one(
      'UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role',
      [name, email, role, id]
    );

    sendSuccess(res, updated, 'User berhasil diupdate');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.oneOrNone('SELECT id FROM users WHERE id = $1', [id]);
    if (!user) {
      return sendError(res, 'User tidak ditemukan', 404);
    }

    await db.none('DELETE FROM users WHERE id = $1', [id]);
    sendSuccess(res, null, 'User berhasil dihapus');
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
