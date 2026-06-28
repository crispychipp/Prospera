'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate dates
    const now = new Date();
    
    // Roti Tawar expires in 2 days (for smart expiry widget)
    const expiryRoti = new Date(now);
    expiryRoti.setDate(now.getDate() + 2);

    // Indomie expires in 6 months
    const expiryIndomie = new Date(now);
    expiryIndomie.setMonth(now.getMonth() + 6);

    // Susu expires in 3 months
    const expirySusu = new Date(now);
    expirySusu.setMonth(now.getMonth() + 3);

    // Kopi expires in 1 year
    const expiryKopi = new Date(now);
    expiryKopi.setFullYear(now.getFullYear() + 1);

    await queryInterface.bulkInsert('Products', [
      {
        product_id: 1,
        user_id_fk: 1,
        product_name: 'Indomie Goreng Spesial',
        product_cost: 2500,
        product_price: 3500,
        product_stock: 150,
        category_id_fk: 1,
        expired_date: expiryIndomie,
        min_display_qty: 20,
        calculated_reorder_point: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 2,
        user_id_fk: 1,
        product_name: 'Roti Tawar Gandum',
        product_cost: 12000,
        product_price: 15000,
        product_stock: 8,
        category_id_fk: 1,
        expired_date: expiryRoti,
        min_display_qty: 5,
        calculated_reorder_point: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 3,
        user_id_fk: 1,
        product_name: 'Susu Beruang Bear Brand',
        product_cost: 8500,
        product_price: 11000,
        product_stock: 40,
        category_id_fk: 2,
        expired_date: expirySusu,
        min_display_qty: 15,
        calculated_reorder_point: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 4,
        user_id_fk: 1,
        product_name: 'Sabun Mandi Cair Lifebuoy',
        product_cost: 18000,
        product_price: 25000,
        product_stock: 25,
        category_id_fk: 3,
        expired_date: null,
        min_display_qty: 10,
        calculated_reorder_point: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 5,
        user_id_fk: 1,
        product_name: 'Kopi Kapal Api Sachet',
        product_cost: 1200,
        product_price: 2000,
        product_stock: 200,
        category_id_fk: 2,
        expired_date: expiryKopi,
        min_display_qty: 50,
        calculated_reorder_point: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
