'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(
      `SELECT product_id, product_name, user_id_fk FROM Products;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categories = await queryInterface.sequelize.query(
      `SELECT category_id, category_name, user_id_fk FROM Categories;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categoryMap = {}; // { user_id: { 'Alat Tulis Kantor': id, 'Makanan / Minuman': id, ... } }
    categories.forEach(cat => {
      if (!categoryMap[cat.user_id_fk]) categoryMap[cat.user_id_fk] = {};
      categoryMap[cat.user_id_fk][cat.category_name] = cat.category_id;
    });

    // Helper to get or create a category for a user
    const getCategoryId = async (ownerId, categoryName) => {
      if (!categoryMap[ownerId]) categoryMap[ownerId] = {};
      if (categoryMap[ownerId][categoryName]) return categoryMap[ownerId][categoryName];

      const now = new Date();
      const insertResult = await queryInterface.sequelize.query(
        `INSERT INTO Categories (user_id_fk, category_name, requires_expired_date, createdAt, updatedAt) 
         VALUES (${ownerId}, '${categoryName}', ${categoryName === 'Makanan / Minuman' || categoryName === 'Obat-obatan / Farmasi' ? true : false}, '${now.toISOString().slice(0, 19).replace('T', ' ')}', '${now.toISOString().slice(0, 19).replace('T', ' ')}');`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const newId = insertResult[0];
      categoryMap[ownerId][categoryName] = newId;
      return newId;
    };

    // Mapping rules
    const rules = [
      { category: 'Alat Tulis Kantor', keywords: ['buku', 'tulis', 'kertas', 'pensil', 'pulpen', 'spidol', 'penghapus', 'penggaris', 'tipe-x', 'lem', 'gunting', 'cutter', 'stapler', 'staples', 'clip', 'krayon', 'map', 'sticky', 'highlighter', 'lakban', 'notes'] },
      { category: 'Makanan / Minuman', keywords: ['teh', 'indomie', 'kopi', 'air', 'susu', 'roti', 'biskuit', 'snack', 'mie', 'minuman', 'makanan'] },
      { category: 'Obat-obatan / Farmasi', keywords: ['obat', 'vitamin', 'paracetamol', 'betadine', 'masker', 'sirup'] },
      { category: 'Pakaian / Fashion', keywords: ['baju', 'celana', 'kaos', 'kemeja', 'topi', 'sepatu', 'sandal'] },
      { category: 'Elektronik / Gadget', keywords: ['kabel', 'charger', 'mouse', 'keyboard', 'flashdisk', 'baterai', 'headset'] },
      { category: 'Perabotan Rumah Tangga', keywords: ['sapu', 'pel', 'ember', 'sikat', 'piring', 'gelas', 'sabun'] }
    ];

    for (const product of products) {
      const name = product.product_name.toLowerCase();
      let targetCategory = 'Lain-lain'; // Sensible default if no match

      for (const rule of rules) {
        if (rule.keywords.some(kw => name.includes(kw))) {
          targetCategory = rule.category;
          break;
        }
      }

      const categoryId = await getCategoryId(product.user_id_fk, targetCategory);
      
      await queryInterface.sequelize.query(
        `UPDATE Products SET category_id_fk = ${categoryId} WHERE product_id = ${product.product_id};`,
        { type: Sequelize.QueryTypes.UPDATE }
      );
    }

    // After all products are migrated, delete the 'Umum' category to fulfill the requirement
    await queryInterface.sequelize.query(
      `DELETE FROM Categories WHERE category_name = 'Umum';`,
      { type: Sequelize.QueryTypes.DELETE }
    );
  },

  async down(queryInterface, Sequelize) {
    // No rollback
  }
};
