'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Tambah kolom ke tabel Products
      await queryInterface.addColumn('Products', 'min_display_qty', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      }, { transaction });

      await queryInterface.addColumn('Products', 'calculated_reorder_point', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      // 2. Buat tabel Anomaly_Tickets
      await queryInterface.createTable('Anomaly_Tickets', {
        ticket_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id_fk: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'user_id' },
          onUpdate: 'CASCADE',
          onDelete: 'NO ACTION'
        },
        anomaly_type: {
          type: Sequelize.ENUM('TIME', 'PRICE'),
          allowNull: false
        },
        reference_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('OPEN', 'RESOLVED', 'DISMISSED'),
          allowNull: false,
          defaultValue: 'OPEN'
        },
        resolution_note: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        resolved_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        resolved_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Users', key: 'user_id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // 3. Buat tabel BlacklistedTokens
      await queryInterface.createTable('BlacklistedTokens', {
        jti: {
          type: Sequelize.STRING(36),
          primaryKey: true,
          allowNull: false
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
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
      await queryInterface.dropTable('BlacklistedTokens', { transaction });
      await queryInterface.dropTable('Anomaly_Tickets', { transaction });
      await queryInterface.removeColumn('Products', 'calculated_reorder_point', { transaction });
      await queryInterface.removeColumn('Products', 'min_display_qty', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
