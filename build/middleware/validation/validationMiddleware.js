"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var validate = function validate(schema) {
  return function (req, res, next) {
    var _schema$validate = schema.validate(req.body),
      error = _schema$validate.error;
    if (error) {
      res.status(400).json({
        error: error.details[0].message
      });
    } else {
      next();
    }
  };
};
var _default = validate;
exports["default"] = _default;
//# sourceMappingURL=validationMiddleware.js.map