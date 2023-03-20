"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JwtUtility = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _dotenv = _interopRequireDefault(require("dotenv"));
_dotenv["default"].config();
var JwtUtility = /*#__PURE__*/function () {
  function JwtUtility() {
    (0, _classCallCheck2["default"])(this, JwtUtility);
  }
  (0, _createClass2["default"])(JwtUtility, null, [{
    key: "generateToken",
    value: function generateToken(userData) {
      return _jsonwebtoken["default"].sign(userData, process.env.SECRET_TOKEN);
    }
  }, {
    key: "verifyToken",
    value: function verifyToken(token) {
      return _jsonwebtoken["default"].verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
        if (err) {
          return err;
        }
        return decoded;
      });
    }
  }]);
  return JwtUtility;
}();
exports.JwtUtility = JwtUtility;
//# sourceMappingURL=jwt.util.js.map