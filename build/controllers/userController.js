"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = exports.getAllUsers = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("../database/models/index"));
var _token_generator = _interopRequireDefault(require("../helpers/token_generator"));
// eslint-disable-next-line import/no-extraneous-dependencies

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
var loginUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body, email, password, user, payload, token;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context2.next = 4;
          return User.findOne({
            where: {
              email: email
            }
          });
        case 4:
          user = _context2.sent;
          _context2.t0 = user;
          if (!_context2.t0) {
            _context2.next = 10;
            break;
          }
          _context2.next = 9;
          return user.checkPassword(password);
        case 9:
          _context2.t0 = _context2.sent;
        case 10:
          if (!_context2.t0) {
            _context2.next = 18;
            break;
          }
          payload = {
            id: user.id,
            email: email
          };
          _context2.next = 14;
          return (0, _token_generator["default"])(payload);
        case 14:
          token = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Login successful',
            token: token
          });
          _context2.next = 19;
          break;
        case 18:
          res.status(401).json({
            status: 401,
            success: false,
            message: 'Invalid credentials'
          });
        case 19:
          _context2.next = 24;
          break;
        case 21:
          _context2.prev = 21;
          _context2.t1 = _context2["catch"](0);
          res.status(500).send({
            status: 500,
            success: false,
            message: 'Failed to Login',
            error: _context2.t1.message
          });
        case 24:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 21]]);
  }));
  return function loginUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.loginUser = loginUser;
var _default = {
  getAllUsers: getAllUsers,
  loginUser: loginUser
};
exports["default"] = _default;
//# sourceMappingURL=userController.js.map