"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var dotenv = _interopRequireWildcard(require("dotenv"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _passport = _interopRequireDefault(require("passport"));
var _passportGoogleOauth = require("passport-google-oauth2");
var _index = _interopRequireDefault(require("../database/models/index"));
var _token_generator = _interopRequireDefault(require("../helpers/token_generator"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var User = _index["default"].User;
dotenv.config();
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
_passport["default"].use(new _passportGoogleOauth.Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "".concat(process.env.URL, "/google/callback"),
  passReqToCallback: true
}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(request, accessToken, refreshToken, profile, done) {
    var given_name, googleUser, TOKEN, userObject, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // eslint-disable-next-line camelcase
          given_name = profile.given_name;
          _context.next = 4;
          return User.findOne({
            where: {
              email: [profile.email]
            }
          });
        case 4:
          googleUser = _context.sent;
          userObject = {
            // eslint-disable-next-line camelcase
            name: given_name,
            email: profile.email,
            token: TOKEN
          };
          if (!googleUser) {
            _context.next = 13;
            break;
          }
          TOKEN = (0, _token_generator["default"])(userObject);
          console.log('The user is saved in our db!!!!!!');
          console.log(TOKEN);
          done(null, profile);
          _context.next = 28;
          break;
        case 13:
          _context.t0 = User;
          _context.t1 = given_name;
          _context.t2 = profile.email;
          _context.next = 18;
          return _bcrypt["default"].hash('password', 10);
        case 18:
          _context.t3 = _context.sent;
          _context.t4 = {
            name: _context.t1,
            email: _context.t2,
            password: _context.t3
          };
          _context.next = 22;
          return _context.t0.create.call(_context.t0, _context.t4);
        case 22:
          user = _context.sent;
          user.save();
          TOKEN = (0, _token_generator["default"])(user);
          console.log('The user is saved in our db!!!!!!');
          console.log(TOKEN);
          done(null, profile);
        case 28:
          _context.next = 33;
          break;
        case 30:
          _context.prev = 30;
          _context.t5 = _context["catch"](0);
          console.log(_context.t5.message);
        case 33:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 30]]);
  }));
  return function (_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}()));
_passport["default"].serializeUser(function (user, done) {
  done(null, user);
});
_passport["default"].deserializeUser(function (user, done) {
  done(null, user);
});
//# sourceMappingURL=passport.js.map