"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _dummyController = require("../controllers/dummyController");
var dummyRoutes = _express["default"].Router();
dummyRoutes.route('/').get(_dummyController.getAllUsers).post(_dummyController.createNewUser);
var _default = dummyRoutes;
exports["default"] = _default;
//# sourceMappingURL=dummyRoutes.js.map