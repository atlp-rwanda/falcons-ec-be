"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.app = void 0;
var dotenv = _interopRequireWildcard(require("dotenv"));
var _express = _interopRequireDefault(require("express"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _swagger = _interopRequireDefault(require("./swagger.json"));
require("./config/passport");
var _passport2 = _interopRequireDefault(require("./routes/passport"));
var _routes = _interopRequireDefault(require("./routes"));
var _productRoutes = _interopRequireDefault(require("./routes/productRoutes"));
var _welcomeRoute = _interopRequireDefault(require("./routes/welcomeRoute"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var app = (0, _express["default"])();
exports.app = app;
dotenv.config();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/api/v1', _productRoutes["default"]);
app.use('/welcome', _welcomeRoute["default"]);
app.use('/api-docs', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"]));
app.use('/', _passport2["default"]);
app.use(_routes["default"]);
app.use((0, _expressSession["default"])({
  secret: process.env.EXPRESS_SESSION,
  resave: false,
  saveUninitialized: false
}));
app.use('/api/v1', userRoutes);
app.use('/', _passport2["default"]);
app.use('/', allRoutes);
app.use('/welcome', _welcomeRoute["default"]);
app.use('/api-docs', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"]));
var _default = app;
exports["default"] = _default;
//# sourceMappingURL=server.js.map