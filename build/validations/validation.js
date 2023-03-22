"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var validator = function validator(Schema) {
  return function (req, res, next) {
    var _Schema$validate = Schema.validate(req.body),
      error = _Schema$validate.error;
    if (error) {
      return res.status(400).send(error.message);
    }
    next();
  };
};
var _default = validator;
exports["default"] = _default;
//# sourceMappingURL=validation.js.map