const { Model } = require('sequelize');
const { v4: uuidv4 } = require("uuid");
const User = require('./user');
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class BlacklistToken extends Model {
    static associate(models) {
      BlacklistToken.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' });
    }
  }

  BlacklistToken.init({
    token: DataTypes.TEXT,
    UserId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    expiresAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'BlacklistToken',
  });
  BlacklistToken.beforeCreate((blacklistToken) => {
    blacklistToken.id = uuidv4();
  });

  return BlacklistToken;
};
