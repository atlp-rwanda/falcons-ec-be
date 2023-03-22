"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function up(queryInterface, Sequelize) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return queryInterface.bulkInsert('Users', [{
              id: '57409d12-ddad-4938-a37a-c17bc33aa4ba',
              email: 'gatete@gmail.com',
              role: 'seller',
              password: "$2a$10$5OSUvABuuOMC5aVqUOrO5.oX07qTeQBz/LX2EtifOrsT3gw2UuJzS",
              //1234
              token: "tokenexample",
              status: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }, {
              id: 'dbc8fb75-2bd9-4e49-90d5-01ebdd4076e2',
              email: 'kylesjet1@gmail.com',
              password: '$2b$10$CmTI8plpPwMC74n4pnod3..JErxlHetqkQqrhTuiwqt9KXC1rV52W',
              role: 'buyer',
              token: 'tokenexample',
              createdAt: '2023-03-17T10:16:59.334Z',
              updatedAt: '2023-03-17T10:16:59.334Z'
            }, {
              id: '80ccebd5-7907-4840-a6af-5a738e8f1d35',
              email: 'boris@gmail.com',
              role: 'seller',
              password: "$2a$10$5OSUvABuuOMC5aVqUOrO5.oX07qTeQBz/LX2EtifOrsT3gw2UuJzS",
              //1234
              token: "tokenexample",
              status: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }, {
              id: '81ccebd5-7907-4940-a6af-5a738e8f1d39',
              email: 'eric@gmail.com',
              role: 'admin',
              password: "$2a$10$5OSUvABuuOMC5aVqUOrO5.oX07qTeQBz/LX2EtifOrsT3gw2UuJzS",
              //1234
              token: "tokenexample",
              status: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }], {});
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
            return queryInterface.bulkDelete('Users', null, {});
          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  }
};
//# sourceMappingURL=20230310074904-userData.js.map