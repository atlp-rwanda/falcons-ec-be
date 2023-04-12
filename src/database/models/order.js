/* eslint-disable require-jsdoc */
const { v4: uuidv4 } = require('uuid');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'buyer_id' });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      buyer_id: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ['successfull', 'pending', 'canceled'],
      },
      total: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  Order.beforeCreate((order) => {
    order.id = uuidv4();
  });
  return Order;
};
