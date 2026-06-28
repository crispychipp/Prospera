'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let bcryptLib;
    try { bcryptLib = require('bcryptjs'); } catch (e) { bcryptLib = require('bcrypt'); }
    const hash = await bcryptLib.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        user_id: 1,
        username: 'Owner Prospera',
        email: 'owner@prospera.com',
        password: hash,
        role: 'owner',
        owner_id: null,
        overtime_unlocked_until: null,
        has_completed_tour: true,
        phone_number: '081234567890',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 2,
        username: 'Kasir Satu',
        email: 'kasir@prospera.com',
        password: hash,
        role: 'karyawan',
        owner_id: 1,
        overtime_unlocked_until: null,
        has_completed_tour: true,
        phone_number: '081234567891',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
