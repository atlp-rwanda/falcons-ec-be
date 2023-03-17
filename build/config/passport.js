"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _passport = _interopRequireDefault(require("passport"));
var _passportGoogleOauth = require("passport-google-oauth2");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _models = _interopRequireDefault(require("../database/models"));
var User = _models["default"].User;
_dotenv["default"].config();
_passport["default"].use(new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "".concat(process.env.CALLBACK_URL, "/google/callback"),
  passReqToCallBack: true
}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(request, accessToken, refreshToken, profile, done) {
    var googleUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return User.findOne({
            where: {
              email: [profile.email]
            }
          });
        case 2:
          googleUser = _context.sent;
          if (googleUser) {
            done(null, profile);
          }
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}()));
_passport["default"].serializeUser(function (user, done) {
  done(null, user);
});
//# sourceMappingURL=passport.js.map