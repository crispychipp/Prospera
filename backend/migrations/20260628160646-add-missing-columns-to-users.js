'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Tambah createdAt
      await queryInterface.addColumn('Users', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });

      // 2. Tambah updatedAt
      await queryInterface.addColumn('Users', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });

      // 3. Tambah overtime_unlocked_until
      await queryInterface.addColumn('Users', 'overtime_unlocked_until', {
        type: Sequelize.DATE,
        allowNull: true,
      }, { transaction });

      // 4. Tambah has_completed_tour
      await queryInterface.addColumn('Users', 'has_completed_tour', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction });

      // 5. Tambah phone_number
      await queryInterface.addColumn('Users', 'phone_number', {
        type: Sequelize.STRING(20),
        allowNull: true,
      }, { transaction });

      // 6. Tambah is_active
      await queryInterface.addColumn('Users', 'is_active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Users', 'createdAt', { transaction });
      await queryInterface.removeColumn('Users', 'updatedAt', { transaction });
      await queryInterface.removeColumn('Users', 'overtime_unlocked_until', { transaction });
      await queryInterface.removeColumn('Users', 'has_completed_tour', { transaction });
      await queryInterface.removeColumn('Users', 'phone_number', { transaction });
      await queryInterface.removeColumn('Users', 'is_active', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
