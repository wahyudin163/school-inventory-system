const express = require('express');
const router = express.Router();

// Import all routes
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const categoryRoutes = require('./categoryRoutes');
const locationRoutes = require('./locationRoutes');
const supplierRoutes = require('./supplierRoutes');
const borrowingRoutes = require('./borrowingRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Use routes
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/categories', categoryRoutes);
router.use('/locations', locationRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/borrowings', borrowingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = router;
