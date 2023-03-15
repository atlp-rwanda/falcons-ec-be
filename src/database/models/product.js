const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, { foreignKey: 'seller_id' });
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });

      // define association here
    }
  }
  Product.init(
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
       categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      category_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Category',
          key: 'id',
        },
      },
      seller_id: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );

  Product.beforeCreate((product) => {
    product.id = uuidv4();
  });

  return Product;
};
