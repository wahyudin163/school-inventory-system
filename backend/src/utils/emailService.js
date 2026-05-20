const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendNotification = async (email, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@sekolah.com',
      to: email,
      subject,
      html: htmlContent
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendBorrowingReminder = async (email, itemName, dueDate) => {
  const htmlContent = `
    <h2>Pengingat Pengembalian Barang</h2>
    <p>Anda meminjam barang: <strong>${itemName}</strong></p>
    <p>Harap dikembalikan pada: <strong>${dueDate}</strong></p>
    <p>Jika ada keterlambatan, akan dikenakan denda sesuai ketentuan sekolah.</p>
  `;
  return sendNotification(email, 'Pengingat Pengembalian Barang', htmlContent);
};

const sendLowStockAlert = async (email, itemName, currentStock) => {
  const htmlContent = `
    <h2>Peringatan Stok Rendah</h2>
    <p>Barang: <strong>${itemName}</strong></p>
    <p>Stok saat ini: <strong>${currentStock}</strong></p>
    <p>Silakan pesan barang sebelum stok habis.</p>
  `;
  return sendNotification(email, 'Peringatan Stok Rendah', htmlContent);
};

module.exports = {
  sendNotification,
  sendBorrowingReminder,
  sendLowStockAlert
};
