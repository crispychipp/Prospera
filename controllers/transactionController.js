const db = require('../config/db');

// 1. Fungsi untuk melakukan checkout/pembayaran (Dilengkapi Sistem Rollback)
const createTransaction = async (req, res) => {
    const userId = req.user.id; 
    const { items } = req.body; 

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Keranjang belanja kosong!" });
    }

    // MEMBUKA KONEKSI KHUSUS UNTUK SISTEM ROLLBACK
    const connection = await db.getConnection();

    try {
        // Memulai sistem Database Transaction.
        // Menjamin seluruh proses (insert & update) tereksekusi seluruhnya, 
        // atau dibatalkan (rollback) sepenuhnya jika terjadi kegagalan sistem.
        await connection.beginTransaction(); 

        let total_amount = 0;
        let validItems = [];

        // 1. Cek stok dan hitung total harga
        for (let item of items) {
            const [products] = await connection.query('SELECT * FROM Products WHERE product_id = ? AND user_id_fk = ? FOR UPDATE', [item.product_id, userId]);
            
            if (products.length === 0) {
                throw new Error(`Produk dengan ID ${item.product_id} tidak ditemukan.`);
            }

            const product = products[0];

            if (product.product_stock < item.quantity) {
                throw new Error(`Stok ${product.product_name} tidak mencukupi. Sisa stok: ${product.product_stock}`);
            }

            const sub_total = product.product_price * item.quantity;
            total_amount += sub_total;

            validItems.push({
                product_id: product.product_id,
                quantity: item.quantity,
                capital_cost: product.product_cost, 
                selling_price: product.product_price, 
                sub_total: sub_total
            });
        }

        // 2. Buat struk di tabel Transactions
        const [transactionResult] = await connection.query(
            'INSERT INTO Transactions (user_id_fk, total_amount) VALUES (?, ?)',
            [userId, total_amount]
        );
        const transactionId = transactionResult.insertId;

        // 3. Masukkan barang ke Transaction_details & Kurangi Stok Produk
        for (let vItem of validItems) {
            await connection.query(
                'INSERT INTO Transaction_details (transaction_id_fk, product_id_fk, quantity, capital_cost, selling_price, sub_total) VALUES (?, ?, ?, ?, ?, ?)',
                [transactionId, vItem.product_id, vItem.quantity, vItem.capital_cost, vItem.selling_price, vItem.sub_total]
            );

            await connection.query(
                'UPDATE Products SET product_stock = product_stock - ? WHERE product_id = ?',
                [vItem.quantity, vItem.product_id]
            );
        }

        // simpan ke database jika sudah cocok
        await connection.commit();
        connection.release();

        res.status(201).json({ 
            message: "Transaksi berhasil diproses!", 
            transaction_id: transactionId,
            total_belanja: total_amount
        });

    } catch (error) {
        // Eksekusi Rollback basis data.
        // Membatalkan seluruh query yang sudah berjalan.
        // apabila terjadi kegagalan pada tahapan query selanjutnya.
        await connection.rollback();
        connection.release();
        
        console.error("Transaksi Gagal, Rollback dilakukan:", error.message);
        
        // Kirim pesan error yang spesifik ke Frontend
        if (error.message.includes("tidak ditemukan") || error.message.includes("tidak mencukupi")) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Terjadi kesalahan pada mesin transaksi." });
        }
    }
};

// 2. Fungsi untuk mengambil riwayat transaksi toko
const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // REVISI: Mengubah 'transaction_date' menjadi 'transaction_datetime' sesuai dengan skema tabel di MySQL
        const [transactions] = await db.query(
            'SELECT * FROM Transactions WHERE user_id_fk = ? ORDER BY transaction_datetime DESC', 
            [userId]
        );
        
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil riwayat transaksi." });
    }
};

module.exports = { createTransaction, getTransactionHistory };