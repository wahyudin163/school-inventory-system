const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { runMigrations } = require('../migrations');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Static files
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Run migrations
    console.log('Running database migrations...');
    await runMigrations();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║  School Inventory System Backend       ║`);
      console.log(`║  Running on port ${PORT}                      ║`);
      console.log(`║  http://localhost:${PORT}                 ║`);
      console.log(`╚════════════════════════════════════════╝\n`);
      console.log('📍 API Health Check: http://localhost:' + PORT + '/api/health');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

startServer();

module.exports = app;
