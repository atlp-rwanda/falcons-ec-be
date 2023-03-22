"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = exports.setRoles = exports.registerUser = exports.loginUser = exports.getAllUsers = exports.disableAccount = exports.createNewUser = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("../database/models/index"));
var _token_generator = _interopRequireDefault(require("../helpers/token_generator"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _bcrypt2 = require("../utils/bcrypt.util");
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
            message: "No users found"
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
            email: email,
            role: user.role,
            status: user.status
          };
          _context2.next = 14;
          return (0, _token_generator["default"])(payload);
        case 14:
          token = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: "Login successful",
            token: token
          });
          _context2.next = 19;
          break;
        case 18:
          res.status(401).json({
            status: 401,
            success: false,
            message: "Invalid credentials"
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
            message: "Failed to Login",
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
          return _bcrypt2.BcryptUtility.hashPassword(req.body.password);
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
var setRoles = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var foundUser, result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (req.params.id) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            message: "User ID not provided"
          }));
        case 2:
          _context4.next = 4;
          return User.findOne({
            where: {
              email: req.params.id
            }
          });
        case 4:
          foundUser = _context4.sent;
          if (foundUser) {
            _context4.next = 7;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            message: "User not found"
          }));
        case 7:
          foundUser.role = req.body.role;
          _context4.next = 10;
          return foundUser.save();
        case 10:
          result = _context4.sent;
          return _context4.abrupt("return", res.json({
            message: "User role updated"
          }));
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function setRoles(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

//user registration for testing purposes
exports.setRoles = setRoles;
var createNewUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var salt, pwd, instance;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _bcrypt["default"].genSalt(10);
        case 3:
          salt = _context5.sent;
          _context5.next = 6;
          return _bcrypt["default"].hash(req.body.password, salt);
        case 6:
          pwd = _context5.sent;
          _context5.next = 9;
          return User.create({
            email: req.body.email,
            password: pwd,
            role: "admin",
            status: true,
            token: ""
          });
        case 9:
          instance = _context5.sent;
          res.json({
            message: "User created"
          });
          _context5.next = 16;
          break;
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json(_context5.t0);
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 13]]);
  }));
  return function createNewUser(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.createNewUser = createNewUser;
var updatePassword = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var userId, user, _req$body2, oldPassword, newPassword, match, salt, hashPassword;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.params.userId; // find a user requesting yo update the password
          // compare his/her oldpassword to
          // password in the db
          _context6.next = 4;
          return User.findByPk(userId);
        case 4:
          user = _context6.sent;
          _req$body2 = req.body, oldPassword = _req$body2.oldPassword, newPassword = _req$body2.newPassword;
          match = _bcrypt["default"].compareSync(oldPassword, user.password);
          if (match) {
            _context6.next = 9;
            break;
          }
          return _context6.abrupt("return", res.status(403).json({
            error: 'Invalid password'
          }));
        case 9:
          _context6.next = 11;
          return _bcrypt["default"].genSalt(10);
        case 11:
          salt = _context6.sent;
          _context6.next = 14;
          return _bcrypt["default"].hash(newPassword, salt);
        case 14:
          hashPassword = _context6.sent;
          _context6.next = 17;
          return user.update({
            password: hashPassword
          });
        case 17:
          _context6.next = 19;
          return user.save();
        case 19:
          return _context6.abrupt("return", res.status(200).json({
            message: 'password updated successfully'
          }));
        case 22:
          _context6.prev = 22;
          _context6.t0 = _context6["catch"](0);
          res.status(400).json({
            error: _context6.t0.message
          });
        case 25:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 22]]);
  }));
  return function updatePassword(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
exports.updatePassword = updatePassword;
var disableAccount = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var foundUser, message, result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          if (req.params.id) {
            _context7.next = 2;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            message: "User ID not provided"
          }));
        case 2:
          _context7.next = 4;
          return User.findOne({
            where: {
              email: req.params.id
            }
          });
        case 4:
          foundUser = _context7.sent;
          if (foundUser) {
            _context7.next = 7;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            message: "User not found"
          }));
        case 7:
          message = "";
          if (foundUser.status === true) {
            foundUser.status = false;
            message = "Account disabled";
          } else {
            foundUser.status = true;
            message = "Account Enabled";
          }
          _context7.next = 11;
          return foundUser.save();
        case 11:
          result = _context7.sent;
          return _context7.abrupt("return", res.json({
            message: message
          }));
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function disableAccount(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
exports.disableAccount = disableAccount;
//# sourceMappingURL=userController.js.map