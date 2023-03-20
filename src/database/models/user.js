/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Product, { foreignKey: 'seller_id' });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    user.id = uuidv4();
  });

  User.prototype.checkPassword = async function (password) {
    const match = await bcrypt.compare(password, this.password);
    return match;
  };

  return User;
};
