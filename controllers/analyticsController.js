const { Transaction, TransactionDetail, Product, sequelize } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

// 1. Summary: Total transaksi, pendapatan, dan rata-rata penjualan
const getSummary = async (req, res) => {
    try {
        const result = await Transaction.findAll({
            attributes: [
                [fn('COUNT', col('*')), 'total_transaction'],
                [fn('SUM', col('total_amount')), 'revenue'],
                [fn('AVG', col('total_amount')), 'average_sale']
            ],
            raw: true
        });
        
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Profit: Menghitung untung dan rugi berdasarkan harga modal vs harga jual
const getProfit = async (req, res) => {
    try {
        const result = await TransactionDetail.findAll({
            attributes: [
                [
                    literal(`SUM(CASE WHEN selling_price > capital_cost THEN (selling_price - capital_cost) * quantity ELSE 0 END)`), 
                    'total_profit'
                ],
                [
                    literal(`SUM(CASE WHEN selling_price < capital_cost THEN (capital_cost - selling_price) * quantity ELSE 0 END)`), 
                    'total_loss'
                ]
            ],
            raw: true
        });

        const profit = parseFloat(result[0].total_profit) || 0;
        const loss = parseFloat(result[0].total_loss) || 0;

        res.json({
            total_profit: profit,
            total_loss: loss,
            net_income: profit - loss
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Top Product: 5 Produk paling laku
const getTopProduct = async (req, res) => {
    try {
        const rows = await TransactionDetail.findAll({
            attributes: [
                [fn('SUM', col('quantity')), 'sold']
            ],
            include: [{
                model: Product,
                attributes: ['product_name'],
                required: true 
            }],
            group: ['Product.product_id', 'Product.product_name'],
            order: [[literal('sold'), 'DESC']],
            limit: 5
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Monthly: Penjualan per bulan
const getMonthly = async (req, res) => {
    try {
        const rows = await Transaction.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('transaction_datetime'), '%Y-%m'), 'month'],
                [fn('SUM', col('total_amount')), 'sales']
            ],
            group: [fn('DATE_FORMAT', col('transaction_datetime'), '%Y-%m')],
            order: [[literal('month'), 'ASC']],
            raw: true
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSummary,
    getProfit,
    getTopProduct,
    getMonthly
};