'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'transaction_type', {
      type: Sequelize.ENUM('buy', 'sell'),
      allowNull: false,
      defaultValue: 'sell'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'transaction_type');
  }
};
