const express = require('express');
const supplierController = require('../controllers/supplierController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Read routes (semua role bisa akses)
router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);

// Write routes (hanya admin dan staff)
router.post('/', authorize('admin', 'staff'), supplierController.createSupplier);
router.put('/:id', authorize('admin', 'staff'), supplierController.updateSupplier);
router.delete('/:id', authorize('admin', 'staff'), supplierController.deleteSupplier);

module.exports = router;
