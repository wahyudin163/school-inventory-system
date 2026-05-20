const { db } = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await db.none('TRUNCATE TABLE activities, maintenance, borrowings, items, suppliers, locations, categories, users CASCADE');

    // Seed Users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await db.none(`
      INSERT INTO users (name, email, password, role) VALUES
      ('Admin Sekolah', 'admin@sekolah.com', $1, 'admin'),
      ('Kepala Sekolah', 'kepala@sekolah.com', $2, 'kepala_sekolah'),
      ('Guru IPA', 'guru.ipa@sekolah.com', $2, 'guru'),
      ('Guru Matematika', 'guru.mtk@sekolah.com', $2, 'guru'),
      ('Staff Inventaris', 'staff@sekolah.com', $2, 'staff')
    `, [adminPassword, userPassword]);

    // Seed Categories
    await db.none(`
      INSERT INTO categories (name, description) VALUES
      ('Peralatan Laboratorium', 'Alat-alat untuk praktikum di laboratorium'),
      ('Peralatan Olahraga', 'Peralatan untuk kegiatan olahraga'),
      ('Peralatan Kantor', 'Perlengkapan kantor dan administrasi'),
      ('Teknologi Informasi', 'Komputer, printer, dan perangkat IT'),
      ('Furniture', 'Meja, kursi, dan perlengkapan ruangan')
    `);

    // Seed Locations
    await db.none(`
      INSERT INTO locations (name, description) VALUES
      ('Laboratorium IPA', 'Ruang laboratorium untuk praktikum IPA'),
      ('Laboratorium Komputer', 'Ruang lab komputer dengan 30 unit PC'),
      ('Ruang Guru', 'Ruang istirahat dan kerja guru'),
      ('Perpustakaan', 'Ruang perpustakaan sekolah'),
      ('Gudang', 'Gudang penyimpanan barang')
    `);

    // Seed Suppliers
    await db.none(`
      INSERT INTO suppliers (name, contact, email, phone, address) VALUES
      ('PT Edutech Indonesia', 'Budi Santoso', 'info@edutech.com', '0812345678', 'Jl. Raya Jakarta No. 123'),
      ('CV Alat Sekolah', 'Siti Nurhaliza', 'contact@alatsekolah.com', '0898765432', 'Jl. Pendidikan No. 45'),
      ('Toko Perlengkapan Kantor', 'Ahmad Wijaya', 'toko@perlengkapan.com', '0878123456', 'Jl. Jenderal No. 78')
    `);

    // Seed Items
    await db.none(`
      INSERT INTO items (name, description, category_id, location_id, supplier_id, quantity, unit, condition, min_stock) VALUES
      ('Mikroskop Binokuler', 'Mikroskop untuk praktikum biologi', 1, 1, 1, 10, 'unit', 'baik', 2),
      ('Bola Basket', 'Bola basket standar internasional', 2, 2, 2, 5, 'buah', 'baik', 2),
      ('Komputer Desktop', 'PC dengan spesifikasi standar untuk pembelajaran', 4, 2, 1, 30, 'unit', 'baik', 5),
      ('Meja Kantor', 'Meja kerja standar untuk kantor', 5, 3, 3, 15, 'unit', 'baik', 3),
      ('Printer HP', 'Printer laser untuk kantor', 4, 3, 1, 3, 'unit', 'baik', 1),
      ('Beaker Glass 250ml', 'Gelas ukur untuk laboratorium', 1, 1, 1, 50, 'buah', 'baik', 10),
      ('Papan Tulis Interaktif', 'Smart board untuk kelas modern', 4, 1, 1, 5, 'unit', 'baik', 1),
      ('Kursi Kerja', 'Kursi ergonomis untuk ruang kantor', 5, 3, 3, 20, 'unit', 'baik', 5)
    `);

    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
