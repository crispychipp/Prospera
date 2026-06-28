'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    await queryInterface.bulkInsert('Anomaly_Tickets', [
      {
        user_id_fk: 1,
        anomaly_type: 'MISSING_STOCK',
        reference_id: 'PRD-4', // Sabun Mandi
        description: 'AI mendeteksi selisih stok Sabun Mandi Cair Lifebuoy pada kasir shift malam sebesar 3 unit.',
        status: 'open',
        resolution_note: null,
        resolved_at: null,
        resolved_by: null,
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo
      },
      {
        user_id_fk: 1,
        anomaly_type: 'PRICE_DROP_ALERT',
        reference_id: 'PRD-2', // Roti Tawar
        description: 'AI mendeteksi anomali: Roti Tawar Gandum dijual rugi secara drastis dalam 3 transaksi berturut-turut.',
        status: 'resolved',
        resolution_note: 'Memang sedang cuci gudang karena hampir expired.',
        resolved_at: now,
        resolved_by: 1,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // yesterday
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Anomaly_Tickets', null, {});
  }
};
