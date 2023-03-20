"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("../controllers/userController");
var _authMiddleware = _interopRequireWildcard(require("../middleware/authMiddleware"));
var _validation = _interopRequireDefault(require("../middleware/validation/validation"));
var _validationMiddleware = _interopRequireDefault(require("../middleware/validation/validationMiddleware"));
var _register = _interopRequireDefault(require("../validations/register.validation"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var userRoutes = _express["default"].Router();
userRoutes.get('/users', _authMiddleware["default"], _userController.getAllUsers);
userRoutes.post('/users/signin', (0, _validationMiddleware["default"])(_validation["default"]), _userController.loginUser);
userRoutes.post('/users/register', _register["default"], _authMiddleware.checkUserExists, _userController.registerUser);
var _default = userRoutes;
exports["default"] = _default;
//# sourceMappingURL=userRoutes.js.map