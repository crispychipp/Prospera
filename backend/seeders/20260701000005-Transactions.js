'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transactions = [];
    const transactionDetails = [];
    const now = new Date();
    let transactionIdCounter = 1;
    let detailIdCounter = 1;

    // Helper to generate a random number between min and max
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Product definitions to match the Products seeder
    const products = [
      { id: 1, cost: 2500, price: 3500 },
      { id: 2, cost: 12000, price: 15000 },
      { id: 3, cost: 8500, price: 11000 },
      { id: 4, cost: 18000, price: 25000 },
      { id: 5, cost: 1200, price: 2000 }
    ];

    // Generate natural sales over the last 60 days
    for (let dayOffset = 60; dayOffset >= 0; dayOffset--) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() - dayOffset);
      
      // Randomly generate 2 to 6 transactions per day
      const txCount = getRandomInt(2, 6);
      
      for (let i = 0; i < txCount; i++) {
        const isMarkdown = (dayOffset < 10 && Math.random() > 0.85); // 15% chance of markdown in the last 10 days
        currentDate.setHours(getRandomInt(8, 20), getRandomInt(0, 59), getRandomInt(0, 59));

        const numItems = getRandomInt(1, 3);
        let totalAmount = 0;
        const currentTxDetails = [];

        for (let j = 0; j < numItems; j++) {
          const product = products[getRandomInt(0, products.length - 1)];
          const qty = getRandomInt(1, 5);
          
          let sellingPrice = product.price;
          // Force some markdown sales specifically for Roti (id 2) or Indomie (id 1) to simulate Smart Expiry loss
          if (isMarkdown && (product.id === 1 || product.id === 2)) {
             sellingPrice = product.id === 1 ? 2000 : 10000; // Below cost
          }

          const subTotal = sellingPrice * qty;
          totalAmount += subTotal;

          currentTxDetails.push({
            detail_id: detailIdCounter++,
            transaction_id_fk: transactionIdCounter,
            product_id_fk: product.id,
            quantity: qty,
            capital_cost: product.cost,
            selling_price: sellingPrice,
            transaction_type: 'sell',
            sub_total: subTotal,
            deletedAt: null
          });
        }

        transactions.push({
          transaction_id: transactionIdCounter,
          user_id_fk: 1,
          cashier_id: 2,
          total_amount: totalAmount,
          transaction_type: 'sell',
          transaction_datetime: new Date(currentDate),
          created_at: new Date(currentDate),
          status: 'success',
          deletedAt: null
        });

        transactionDetails.push(...currentTxDetails);
        transactionIdCounter++;
      }
    }

    // Explicitly add 3 Markdown Transactions (Cuci Gudang) if not randomly generated enough
    for (let k = 0; k < 3; k++) {
      const markdownDate = new Date(now);
      markdownDate.setDate(now.getDate() - k - 1);
      
      const product = products[1]; // Roti Tawar (Cost: 12000)
      const qty = 2;
      const sellingPrice = 9000; // Rugi 3000 per qty
      const subTotal = sellingPrice * qty;

      transactions.push({
        transaction_id: transactionIdCounter,
        user_id_fk: 1,
        cashier_id: 2,
        total_amount: subTotal,
        transaction_type: 'sell',
        transaction_datetime: markdownDate,
        created_at: markdownDate,
        status: 'success',
        deletedAt: null
      });

      transactionDetails.push({
        detail_id: detailIdCounter++,
        transaction_id_fk: transactionIdCounter,
        product_id_fk: product.id,
        quantity: qty,
        capital_cost: product.cost,
        selling_price: sellingPrice,
        transaction_type: 'sell',
        sub_total: subTotal,
        deletedAt: null
      });
      transactionIdCounter++;
    }

    await queryInterface.bulkInsert('Transactions', transactions, {});
    await queryInterface.bulkInsert('Transaction_details', transactionDetails, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Transaction_details', null, {});
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
