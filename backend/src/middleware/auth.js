const { verifyToken } = require('../config/jwt');
const { sendError } = require('../utils/responseHandler');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Token tidak ditemukan', 401);
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Token tidak valid', 403);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'User tidak ditemukan', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Anda tidak memiliki akses', 403);
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorize
};
