"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegisterController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _user = require("../services/user.service");
var _bcrypt = require("../utils/bcrypt.util");
var _jwt = require("../utils/jwt.util");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var RegisterController = /*#__PURE__*/function () {
  function RegisterController() {
    (0, _classCallCheck2["default"])(this, RegisterController);
  }
  (0, _createClass2["default"])(RegisterController, null, [{
    key: "registerUser",
    value: function () {
      var _registerUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
        var user, _yield$UserService$re, id, email, userData, userToken;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              user = _objectSpread({}, req.body);
              _context.next = 4;
              return _bcrypt.BcryptUtility.hashPassword(req.body.password);
            case 4:
              user.password = _context.sent;
              _context.next = 7;
              return _user.UserService.register(user);
            case 7:
              _yield$UserService$re = _context.sent;
              id = _yield$UserService$re.id;
              email = _yield$UserService$re.email;
              userData = {
                id: id,
                email: email
              };
              userToken = _jwt.JwtUtility.generateToken(userData);
              return _context.abrupt("return", res.status(201).json({
                user: userData,
                token: userToken
              }));
            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", res.status(500).json({
                error: _context.t0.message,
                message: 'Failed to register a new user'
              }));
            case 18:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 15]]);
      }));
      function registerUser(_x, _x2) {
        return _registerUser.apply(this, arguments);
      }
      return registerUser;
    }()
  }]);
  return RegisterController;
}();
exports.RegisterController = RegisterController;
//# sourceMappingURL=user.controller.js.map