"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUser = exports.loginUser = exports.getAllUsers = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("../database/models/index"));
var _token_generator = _interopRequireDefault(require("../helpers/token_generator"));
var _bcrypt = require("../utils/bcrypt.util");
var _user = require("../services/user.service");
var _jwt = require("../utils/jwt.util");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
var registerUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var user, _yield$UserService$re, id, email, userData, userToken;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          user = _objectSpread({}, req.body);
          _context3.next = 4;
          return _bcrypt.BcryptUtility.hashPassword(req.body.password);
        case 4:
          user.password = _context3.sent;
          _context3.next = 7;
          return _user.UserService.register(user);
        case 7:
          _yield$UserService$re = _context3.sent;
          id = _yield$UserService$re.id;
          email = _yield$UserService$re.email;
          userData = {
            id: id,
            email: email
          };
          userToken = _jwt.JwtUtility.generateToken(userData);
          return _context3.abrupt("return", res.status(201).json({
            user: userData,
            token: userToken
          }));
        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            error: _context3.t0.message,
            message: 'Failed to register a new user'
          }));
        case 18:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 15]]);
  }));
  return function registerUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.registerUser = registerUser;
var _default = {
  getAllUsers: getAllUsers,
  loginUser: loginUser
};
exports["default"] = _default;
//# sourceMappingURL=userController.js.map