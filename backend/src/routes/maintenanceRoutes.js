const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Read routes (semua role bisa akses)
router.get('/', maintenanceController.getAllMaintenance);
router.get('/:id', maintenanceController.getMaintenanceById);

// Write routes (hanya admin, kepala_sekolah, dan staff)
router.post('/', authorize('admin', 'kepala_sekolah', 'staff', 'guru'), maintenanceController.createMaintenance);
router.put('/:id', authorize('admin', 'staff'), maintenanceController.updateMaintenance);
router.delete('/:id', authorize('admin'), maintenanceController.deleteMaintenance);

module.exports = router;
