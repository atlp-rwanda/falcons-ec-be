"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _register = _interopRequireDefault(require("../../validations/register.validation"));
var _user = require("../../middlewares/user.middleware");
var _user2 = require("../../controllers/user.controller");
var router = _express["default"].Router();
router.post('/register', _register["default"], _user.checkUserExists, _user2.RegisterController.registerUser);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=user.routes.js.map