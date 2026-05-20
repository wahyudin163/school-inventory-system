# School Inventory Management System

Aplikasi Inventaris Sekolah yang komprehensif dengan fitur peminjaman alat, barcode/QR code, dan laporan.

## Fitur Utama

✅ Dashboard statistik  
✅ Data barang inventaris  
✅ Kategori barang  
✅ Lokasi / ruangan  
✅ Data supplier  
✅ Peminjaman & pengembalian  
✅ Barcode / QR Code inventaris  
✅ Cetak label inventaris  
✅ Manajemen pengguna & hak akses  
✅ Riwayat aktivitas  
✅ Laporan PDF / Excel  
✅ Upload foto barang  
✅ Notifikasi stok / kondisi barang  
✅ Maintenance barang  
✅ Scan barcode menggunakan kamera HP  

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer (Upload File)
- jsBarcode (Generate Barcode)

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router
- Chart.js
- html5-qrcode (QR Scanner)
- jsPDF & XLSX (Export)

## Instalasi

### Prerequisites
- Node.js v14+
- PostgreSQL 12+
- npm atau yarn

### Backend Setup

```bash
cd backend
npm install

# Setup environment
cp .env.example .env

# Sesuaikan konfigurasi database di .env

# Run migrations
npm run migrate

# Start server
npm start
```

### Frontend Setup

```bash
cd frontend
npm install

# Setup environment
cp .env.example .env

# Start development server
npm start
```

## Default Credentials

**Admin Account:**
- Email: admin@sekolah.com
- Password: admin123

## Struktur Folder

```
school-inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── migrations/
│   ├── seeds/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## API Documentation

See `API.md` untuk dokumentasi lengkap endpoint API.

## Contributing

Pull requests are welcome. Untuk perubahan besar, silakan buka issue terlebih dahulu untuk mendiskusikan perubahan.

## License

MIT License
