"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _passport = _interopRequireDefault(require("passport"));
var _token_generator = _interopRequireDefault(require("../helpers/token_generator"));
var passportRouter = _express["default"].Router();
passportRouter.get('/', function (req, res) {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
passportRouter.get('/auth/google', _passport["default"].authenticate('google', {
  scope: ['email', 'profile']
}));
passportRouter.get('/google/callback', _passport["default"].authenticate('google', {
  successRedirect: '/welcome',
  failureRedirect: '/auth/google'
}));
var _default = passportRouter;
exports["default"] = _default;
//# sourceMappingURL=passport.js.map