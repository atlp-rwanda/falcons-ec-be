"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _joiPassword = require("joi-password");
var joiPassword = _joi["default"].extend(_joiPassword.joiPasswordExtendCore);
var validateRegister = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var registerSchema, _registerSchema$valid, error;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          registerSchema = _joi["default"].object().keys({
            firstname: _joi["default"].string().min(3).trim().required(),
            lastname: _joi["default"].string().min(3).trim().required(),
            email: _joi["default"].string().email().lowercase().trim().required(),
            phone: _joi["default"].string().min(10).trim(),
            password: joiPassword.string().min(8).minOfUppercase(1).minOfNumeric(1).required().trim()
          });
          _registerSchema$valid = registerSchema.validate(req.body), error = _registerSchema$valid.error;
          if (!error) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, '')
          }));
        case 4:
          next();
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function validateRegister(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var _default = validateRegister;
exports["default"] = _default;
//# sourceMappingURL=register.validation.js.map