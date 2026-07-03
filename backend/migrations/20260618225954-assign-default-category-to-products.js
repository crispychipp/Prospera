'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Ambil semua owner yang memiliki produk tanpa kategori
    const ownersWithOrphanedProducts = await queryInterface.sequelize.query(
      `SELECT DISTINCT user_id_fk FROM Products WHERE category_id_fk IS NULL;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (ownersWithOrphanedProducts.length === 0) {
      console.log("Semua produk sudah memiliki kategori. Melewati migrasi ini.");
      return;
    }

    // 2. Untuk setiap owner, buatkan kategori 'Umum' dan update produknya
    for (const row of ownersWithOrphanedProducts) {
      const ownerId = row.user_id_fk;

      // Cek apakah kategori 'Umum' sudah ada untuk owner ini
      const existingCategory = await queryInterface.sequelize.query(
        `SELECT category_id FROM Categories WHERE category_name = 'Umum' AND user_id_fk = ${ownerId} LIMIT 1;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      let categoryId;

      if (existingCategory.length > 0) {
        categoryId = existingCategory[0].category_id;
      } else {
        // Buat kategori 'Umum'
        const now = new Date();
        const insertResult = await queryInterface.sequelize.query(
          `INSERT INTO Categories (user_id_fk, category_name, requires_expired_date, createdAt, updatedAt) 
           VALUES (${ownerId}, 'Umum', false, '${now.toISOString().slice(0, 19).replace('T', ' ')}', '${now.toISOString().slice(0, 19).replace('T', ' ')}');`,
          { type: Sequelize.QueryTypes.INSERT }
        );
        // queryInterface.sequelize.query INSERT mengembalikan array: [id, affectedRows] pada MySQL
        categoryId = insertResult[0]; 
      }

      // Update semua produk milik owner ini yang kategorinya masih NULL
      if (categoryId) {
        await queryInterface.sequelize.query(
          `UPDATE Products SET category_id_fk = ${categoryId} WHERE user_id_fk = ${ownerId} AND category_id_fk IS NULL;`,
          { type: Sequelize.QueryTypes.UPDATE }
        );
      }
    }
  },

  async down (queryInterface, Sequelize) {
    // Tidak ada rollback yang masuk akal untuk data migration semacam ini, 
    // karena kita tidak tahu produk mana yang tadinya NULL.
    // Tapi kita bisa sediakan empty function.
  }
};
