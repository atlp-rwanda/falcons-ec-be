"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _welcomeRoute = _interopRequireDefault(require("./welcomeRoute"));
var _user = _interopRequireDefault(require("./api/user.routes"));
var router = (0, _express.Router)();
router.use('/welcome', _welcomeRoute["default"]);
router.use('/users', _user["default"]);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=index.js.map