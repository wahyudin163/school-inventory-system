const express = require('express');
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const categoryRoutes = require('./categoryRoutes');
const locationRoutes = require('./locationRoutes');
const supplierRoutes = require('./supplierRoutes');
const borrowingRoutes = require('./borrowingRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'School Inventory System API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/categories', categoryRoutes);
router.use('/locations', locationRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/borrowings', borrowingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
