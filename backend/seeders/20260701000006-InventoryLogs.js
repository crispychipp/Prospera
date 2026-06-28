'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    await queryInterface.bulkInsert('InventoryLogs', [
      {
        user_id_fk: 1,
        product_id_fk: 2, // Roti Tawar
        action: 'add',
        quantity: 50,
        spoilage_loss: 0,
        notes: 'Restock mingguan dari supplier',
        createdAt: yesterday,
        updatedAt: yesterday
      },
      {
        user_id_fk: 1,
        product_id_fk: 2, // Roti Tawar
        action: 'spoilage',
        quantity: 5,
        spoilage_loss: 5 * 12000, // 5 x 12000 = 60000
        notes: 'Roti basi berjamur, dibuang',
        createdAt: now,
        updatedAt: now
      },
      {
        user_id_fk: 1,
        product_id_fk: 1, // Indomie
        action: 'add',
        quantity: 200,
        spoilage_loss: 0,
        notes: 'Restock gudang utama',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('InventoryLogs', null, {});
  }
};
