const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all maintenance records
router.get('/', authenticateToken, maintenanceController.getAllMaintenance);

// Get maintenance by ID
router.get('/:id', authenticateToken, maintenanceController.getMaintenanceById);

// Create maintenance record
router.post('/', authenticateToken, maintenanceController.createMaintenance);

// Update maintenance
router.put('/:id', authenticateToken, authorize('admin', 'staff'), maintenanceController.updateMaintenance);

// Delete maintenance
router.delete('/:id', authenticateToken, authorize('admin'), maintenanceController.deleteMaintenance);

module.exports = router;
