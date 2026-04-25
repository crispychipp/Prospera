const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi untuk mendaftarkan pengguna baru
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validasi input kosong (Cegah data hantu)
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Semua kolom (username, email, password) wajib diisi!" });
        }

        // Memeriksa apakah email sudah terdaftar di database
        const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email tersebut sudah terdaftar." });
        }

        // Melakukan hashing pada kata sandi (Satpam Satu Arah)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Menyimpan data pengguna ke dalam tabel Users
        const [result] = await db.query(
            'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]
        );

        res.status(201).json({ 
            message: "Akun berhasil dibuat.", 
            userId: result.insertId 
        });

    } catch (error) {
        console.error("Kesalahan pada proses registrasi:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

// Fungsi untuk menghapus pengguna (Hanya bisa menghapus akun sendiri)
const deleteUser = async (req, res) => {
    try {
        // Ambil ID dari Token (req.user), bukan dari URL (req.params)
        const idTarget = req.user.id; 

        // Menjalankan query untuk menghapus data pengguna
        const [result] = await db.query('DELETE FROM Users WHERE user_id = ?', [idTarget]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        res.status(200).json({ message: "Data pengguna berhasil dihapus secara permanen." });

    } catch (error) {
        console.error("Kesalahan pada proses penghapusan pengguna:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

// Fungsi untuk proses login pengguna
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Mencari data pengguna berdasarkan email
        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: "Email tidak terdaftar." });
        }

        const user = users[0];

        // Memverifikasi kecocokan kata sandi
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Kata sandi yang Anda masukkan salah." });
        }

        // Menghasilkan token JWT jika autentikasi berhasil
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Kirim data user bersamaan dengan token
        res.status(200).json({
            message: "Login berhasil.",
            token: token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Kesalahan pada proses login:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

module.exports = { register, deleteUser, login };