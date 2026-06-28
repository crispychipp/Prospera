'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        category_id: 1,
        user_id_fk: 1,
        category_name: 'Makanan Ringan',
        requires_expired_date: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 2,
        user_id_fk: 1,
        category_name: 'Minuman',
        requires_expired_date: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 3,
        user_id_fk: 1,
        category_name: 'Kebutuhan Harian',
        requires_expired_date: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
