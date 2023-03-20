"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BcryptUtility = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var BcryptUtility = /*#__PURE__*/function () {
  function BcryptUtility() {
    (0, _classCallCheck2["default"])(this, BcryptUtility);
  }
  (0, _createClass2["default"])(BcryptUtility, null, [{
    key: "hashPassword",
    value: function () {
      var _hashPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(password) {
        var pasSalt;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _bcrypt["default"].genSalt(10);
            case 2:
              pasSalt = _context.sent;
              _context.next = 5;
              return _bcrypt["default"].hash(password, pasSalt);
            case 5:
              return _context.abrupt("return", _context.sent);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function hashPassword(_x) {
        return _hashPassword.apply(this, arguments);
      }
      return hashPassword;
    }()
  }]);
  return BcryptUtility;
}();
exports.BcryptUtility = BcryptUtility;
//# sourceMappingURL=bcrypt.util.js.map