"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("../database/models/index"));
var User = _index["default"].User;
var findOneUserService = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id) {
    var findOneUserRequest;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return User.findOne({
            where: {
              id: id
            }
          });
        case 2:
          findOneUserRequest = _context.sent;
          return _context.abrupt("return", findOneUserRequest);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function findOneUserService(_x) {
    return _ref.apply(this, arguments);
  };
}();
var _default = findOneUserService;
exports["default"] = _default;
//# sourceMappingURL=authService.js.map