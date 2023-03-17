"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("../controllers/userController");
var _authMiddleware = _interopRequireDefault(require("../middleware/authMiddleware"));
var _validation = _interopRequireDefault(require("../middleware/validation/validation"));
var _validationMiddleware = _interopRequireDefault(require("../middleware/validation/validationMiddleware"));
var userRoutes = _express["default"].Router();
userRoutes.get('/users', _authMiddleware["default"], _userController.getAllUsers);
userRoutes.post('/users/signin', (0, _validationMiddleware["default"])(_validation["default"]), _userController.loginUser);
var _default = userRoutes;
exports["default"] = _default;
//# sourceMappingURL=userRoutes.js.map