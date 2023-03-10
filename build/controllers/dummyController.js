"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllUsers = exports["default"] = exports.createNewUser = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _index = _interopRequireDefault(require("../database/models/index"));
var User = _index["default"].User;
var getAllUsers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var allUsers;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return User.findAll();
        case 2:
          allUsers = _context.sent;
          if (!allUsers) res.status(400).json({
            message: 'No users found'
          });
          res.json(allUsers);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getAllUsers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getAllUsers = getAllUsers;
var createNewUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var salt, pwd, instance;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _bcrypt["default"].genSalt(10);
        case 3:
          salt = _context2.sent;
          _context2.next = 6;
          return _bcrypt["default"].hash(req.body.password, salt);
        case 6:
          pwd = _context2.sent;
          _context2.next = 9;
          return User.create({
            email: req.body.email,
            password: pwd
          });
        case 9:
          instance = _context2.sent;
          res.json({
            message: 'User created'
          });
          _context2.next = 16;
          break;
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          res.status(400).json(_context2.t0);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return function createNewUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.createNewUser = createNewUser;
var _default = {
  getAllUsers: getAllUsers,
  createNewUser: createNewUser
};
exports["default"] = _default;
//# sourceMappingURL=dummyController.js.map