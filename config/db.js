const mysql = require('mysql2');
require('dotenv').config();

// Membuat pool koneksi untuk database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    
    timezone: '+07:00', // Mengatur zona waktu ke WIB (Atur sesuai lokasi jika perlu)
    dateStrings: true   // Mencegah Node.js memanipulasi jam transaksi secara sepihak
});

// Menguji koneksi ke database saat inisialisasi
db.getConnection((err, connection) => {
    if (err) {
        console.error("Koneksi ke database gagal. Error:", err.message);
    } else {
        // Mengambil nama database langsung dari file .env
        console.log(`Database MySQL '${process.env.DB_NAME}' berhasil terkoneksi.`);
        connection.release();
    }
});

// Menggunakan promise untuk mendukung implementasi async/await
module.exports = db.promise();