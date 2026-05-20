const express = require('express');
const locationController = require('../controllers/locationController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Read routes (semua role bisa akses)
router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);

// Write routes (hanya admin)
router.post('/', authorize('admin'), locationController.createLocation);
router.put('/:id', authorize('admin'), locationController.updateLocation);
router.delete('/:id', authorize('admin'), locationController.deleteLocation);

module.exports = router;
