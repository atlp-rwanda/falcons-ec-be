'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    user.id = uuidv4();
  });

  User.prototype.checkPassword = async function (password) {
    const match = await bcrypt.compare(password, this.password);
    return match;
  };

  return User;
};
