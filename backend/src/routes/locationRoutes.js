const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all locations
router.get('/', authenticateToken, locationController.getAllLocations);

// Get location by ID
router.get('/:id', authenticateToken, locationController.getLocationById);

// Create location
router.post('/', authenticateToken, authorize('admin', 'staff'), locationController.createLocation);

// Update location
router.put('/:id', authenticateToken, authorize('admin', 'staff'), locationController.updateLocation);

// Delete location
router.delete('/:id', authenticateToken, authorize('admin'), locationController.deleteLocation);

module.exports = router;
