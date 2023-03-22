const { DataTypes } = require('sequelize');
const { User } = require('../models');
/** @type {import('sequelize-cli').Migration} */
// "use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BlacklistTokens', {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
        },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expiresAt:{
        allowNull:false,
        type: Sequelize.DATE
      },

      UserId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BlacklistTokens');
  }
};
