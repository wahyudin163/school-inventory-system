const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: errors.array()
    });
  }
  next();
};

// Validators untuk User
const validateUser = () => [
  body('name').notEmpty().withMessage('Nama harus diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').isIn(['admin', 'kepala_sekolah', 'guru', 'staff']).withMessage('Role tidak valid')
];

// Validators untuk Barang
const validateItem = () => [
  body('name').notEmpty().withMessage('Nama barang harus diisi'),
  body('category_id').isInt().withMessage('Kategori harus dipilih'),
  body('location_id').isInt().withMessage('Lokasi harus dipilih'),
  body('quantity').isInt({ min: 0 }).withMessage('Jumlah harus angka positif'),
  body('unit').notEmpty().withMessage('Satuan harus diisi'),
  body('condition').isIn(['baik', 'rusak_ringan', 'rusak_berat']).withMessage('Kondisi tidak valid')
];

// Validators untuk Peminjaman
const validateBorrowing = () => [
  body('item_id').isInt().withMessage('Barang harus dipilih'),
  body('borrowed_by').isInt().withMessage('Peminjam harus dipilih'),
  body('quantity').isInt({ min: 1 }).withMessage('Jumlah harus minimal 1'),
  body('due_date').isISO8601().withMessage('Tanggal kembali tidak valid')
];

module.exports = {
  validateRequest,
  validateUser,
  validateItem,
  validateBorrowing
};
