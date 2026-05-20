const JsBarcode = require('jsbarcode');
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');

const generateBarcode = async (itemId, itemName) => {
  try {
    const barcodeDir = path.join(process.env.UPLOAD_DIR || './uploads', 'barcodes');
    
    if (!fs.existsSync(barcodeDir)) {
      fs.mkdirSync(barcodeDir, { recursive: true });
    }

    const filename = `barcode_${itemId}.svg`;
    const filepath = path.join(barcodeDir, filename);

    // Buat canvas kosong
    const canvasInstance = canvas.createCanvas(200, 100);
    const ctx = canvasInstance.getContext('2d');

    JsBarcode(canvasInstance, `ITEM-${itemId}`, {
      format: 'CODE128',
      width: 2,
      height: 50,
      displayValue: true
    });

    // Simpan sebagai SVG
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
        <text x="100" y="20" text-anchor="middle" font-size="12">${itemName}</text>
        <image x="0" y="30" width="200" height="70" href="data:image/png;base64,${canvasInstance.toDataURL('image/png')}"/>
      </svg>
    `;

    fs.writeFileSync(filepath, svg);
    return `/uploads/barcodes/${filename}`;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
};

module.exports = { generateBarcode };
