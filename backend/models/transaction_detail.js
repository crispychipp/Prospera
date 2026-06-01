module.exports = (sequelize, DataTypes) => {
  const TransactionDetail = sequelize.define('TransactionDetail', {
    detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    transaction_id_fk: {
      type: DataTypes.INTEGER
    },
    product_id_fk: {
      type: DataTypes.INTEGER
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    capital_cost: {
      type: DataTypes.INTEGER
    },
    selling_price: {
      type: DataTypes.INTEGER
    },
    transaction_type: {
      type: DataTypes.ENUM('buy', 'sell'),
      defaultValue: 'sell',
      allowNull: false
    },
    sub_total: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Transaction_details',
    timestamps: false
  });

  return TransactionDetail;
};