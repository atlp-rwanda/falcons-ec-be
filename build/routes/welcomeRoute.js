"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _welcomeController = _interopRequireDefault(require("../controllers/welcomeController"));
var welcomeRoute = _express["default"].Router();
welcomeRoute.route('/').get(_welcomeController["default"]);
var _default = welcomeRoute;
exports["default"] = _default;
//# sourceMappingURL=welcomeRoute.js.map