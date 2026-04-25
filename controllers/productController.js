const db = require('../config/db');

// 1. Mengambil semua produk milik user yang sedang login
const getAllProducts = async (req, res) => {
    try {
        const userId = req.user.id; 
        const [products] = await db.query('SELECT * FROM Products WHERE user_id_fk = ?', [userId]);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

// 2. Mengambil satu produk secara spesifik 
const getProductById = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const [products] = await db.query('SELECT * FROM Products WHERE product_id = ? AND user_id_fk = ?', [productId, userId]);
        
        if (products.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }
        res.status(200).json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

// 3. Menambah produk baru
const createProduct = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { product_name, product_cost, product_price, product_stock } = req.body;
        
        // Validasi input agar tidak ada data kosong yang masuk ke database
        if (!product_name || product_cost === undefined || product_price === undefined) {
            return res.status(400).json({ message: "Nama, Harga Modal, dan Harga Jual wajib diisi!" });
        }

        const [result] = await db.query(
            'INSERT INTO Products (user_id_fk, product_name, product_cost, product_price, product_stock) VALUES (?, ?, ?, ?, ?)',
            [userId, product_name, product_cost, product_price, product_stock || 0]
        );

        res.status(201).json({ 
            message: "Produk berhasil ditambahkan ke toko Anda.", 
            productId: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

// 4. Memperbarui produk 
const updateProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const { product_name, product_cost, product_price, product_stock } = req.body;

        // Validasi input sebelum diupdate
        if (!product_name || product_cost === undefined || product_price === undefined) {
            return res.status(400).json({ message: "Nama, Harga Modal, dan Harga Jual tidak boleh kosong!" });
        }

        const [result] = await db.query(
            'UPDATE Products SET product_name = ?, product_cost = ?, product_price = ?, product_stock = ? WHERE product_id = ? AND user_id_fk = ?',
            [product_name, product_cost, product_price, product_stock, productId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan atau bukan milik Anda." });
        }
        res.status(200).json({ message: "Data produk berhasil diperbarui." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

// 5. Menghapus produk
const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const [result] = await db.query(
            'DELETE FROM Products WHERE product_id = ? AND user_id_fk = ?', 
            [productId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan atau bukan milik Anda." });
        }
        res.status(200).json({ message: "Produk berhasil dihapus." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };