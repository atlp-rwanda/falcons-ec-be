"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _authService = _interopRequireDefault(require("../services/authService"));
// eslint-disable-next-line import/no-extraneous-dependencies

var isLoggedIn = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, decodedData, currentUser, userObj;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!req.headers.authorization) {
            _context.next = 16;
            break;
          }
          token = req.headers.authorization.split(' ')[1];
          _context.prev = 2;
          decodedData = _jsonwebtoken["default"].verify(token, "".concat(process.env.JWT_SECRET));
          _context.next = 6;
          return (0, _authService["default"])(decodedData.payload.id);
        case 6:
          currentUser = _context.sent;
          userObj = {
            id: currentUser.id,
            email: currentUser.email
          };
          if (!currentUser) {
            res.status(401).json({
              status: 401,
              success: false,
              message: 'User does not exist!'
            });
          } else {
            req.user = userObj;
            next();
          }
          _context.next = 14;
          break;
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](2);
          res.status(500).json({
            status: 500,
            success: false,
            message: "Error when authorizing user ".concat(_context.t0.message)
          });
        case 14:
          _context.next = 17;
          break;
        case 16:
          res.status(401).json({
            status: 401,
            success: false,
            message: 'Not logged in'
          });
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[2, 11]]);
  }));
  return function isLoggedIn(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var _default = isLoggedIn;
exports["default"] = _default;
//# sourceMappingURL=authMiddleware.js.map