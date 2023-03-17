"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _joi = _interopRequireDefault(require("joi"));
// eslint-disable-next-line import/no-extraneous-dependencies

var userSchema = _joi["default"].object({
  email: _joi["default"].string().email().required(),
  password: _joi["default"].string().required()
});
var _default = userSchema;
exports["default"] = _default;
//# sourceMappingURL=validation.js.map