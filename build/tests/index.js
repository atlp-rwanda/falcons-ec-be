"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _chai = _interopRequireDefault(require("chai"));
var _chaiHttp = _interopRequireDefault(require("chai-http"));
var _server = _interopRequireDefault(require("../server.js"));
var _index = _interopRequireDefault(require("../database/models/index"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var expect = _chai["default"].expect;
_chai["default"].should();
_chai["default"].use(_chaiHttp["default"]);
describe("Welcome Controller", function () {
  before( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _index["default"].sequelize.sync({
            force: true
          });
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  describe("GET /welcome", function () {
    it("should return a 200 response and a welcome message", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var res;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _chai["default"].request(_server["default"]).get("/welcome");
          case 2:
            res = _context2.sent;
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal("Test controller OK");
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })));
  });
});
describe("Dummy Routes", function () {
  describe("GET /", function () {
    it("should return an array of all users", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var res;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _chai["default"].request(_server["default"]).get("/");
          case 2:
            res = _context3.sent;
            expect(res).to.have.status(404);
            expect(res.body).to.be.an("array");
            expect(res.body.length).to.be.greaterThan(0);
          case 6:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })));
    it("should return an error message if no users are found", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var res;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _index["default"].User.destroy({
              where: {}
            });
          case 2:
            _context4.next = 4;
            return _chai["default"].request(_server["default"]).get("/");
          case 4:
            res = _context4.sent;
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal("No users found");
          case 7:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    })));
  });
  describe("POST /", function () {
    it("should create a new user", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var res;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _chai["default"].request(_server["default"]).post("/").send({
              email: "test@example.com",
              password: "password"
            });
          case 2:
            res = _context5.sent;
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal("User created");
          case 5:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    })));
  });
});
//# sourceMappingURL=index.js.map