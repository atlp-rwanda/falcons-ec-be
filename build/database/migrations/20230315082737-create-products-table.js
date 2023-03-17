"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var User = require('../models/user');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function up(queryInterface, Sequelize) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return queryInterface.createTable('Products', {
              id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
              },
              productName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                  notEmpty: true
                }
              },
              description: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                  notEmpty: true
                }
              },
              images: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                allowNull: true,
                validate: {
                  notEmpty: false
                }
              },
              price: {
                type: Sequelize.FLOAT,
                allowNull: false,
                validate: {
                  notEmpty: true
                }
              },
              quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                  notEmpty: true
                }
              },
              expiryDate: {
                type: Sequelize.DATE,
                allowNull: true,
                validate: {
                  notEmpty: false
                }
              },
              createdAt: {
                allowNull: false,
                type: Sequelize.DATE
              },
              updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
              },
              // Add Category_id when the model is created,
              seller_id: {
                type: Sequelize.UUID,
                references: {
                  model: 'Users',
                  key: 'id'
                }
              }
            });
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  down: function down(queryInterface, Sequelize) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return queryInterface.dropTable('Products');
          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  }
};
//# sourceMappingURL=20230315082737-create-products-table.js.map