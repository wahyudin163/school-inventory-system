const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all suppliers
router.get('/', authenticateToken, supplierController.getAllSuppliers);

// Get supplier by ID
router.get('/:id', authenticateToken, supplierController.getSupplierById);

// Create supplier
router.post('/', authenticateToken, authorize('admin', 'staff'), supplierController.createSupplier);

// Update supplier
router.put('/:id', authenticateToken, authorize('admin', 'staff'), supplierController.updateSupplier);

// Delete supplier
router.delete('/:id', authenticateToken, authorize('admin'), supplierController.deleteSupplier);

module.exports = router;
