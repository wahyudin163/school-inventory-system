const jwt = require('jsonwebtoken');

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  expiresIn: process.env.JWT_EXPIRE || '7d'
};

const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error('Token tidak valid');
  }
};

module.exports = {
  jwtConfig,
  generateToken,
  verifyToken
};
