"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _chai = _interopRequireWildcard(require("chai"));
var _chaiHttp = _interopRequireDefault(require("chai-http"));
var _supertest = _interopRequireDefault(require("supertest"));
var _passportStub = _interopRequireDefault(require("passport-stub"));
var _passport = _interopRequireDefault(require("passport"));
var _server = _interopRequireDefault(require("../server.js"));
var _index = _interopRequireDefault(require("../database/models/index"));
var _token_generator = _interopRequireDefault(require("../helpers/token_generator.js"));
var _fs = _interopRequireDefault(require("fs"));
var _regeneratorRuntime2 = require("regenerator-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var expect = _chai["default"].expect;
_chai["default"].should();
_chai["default"].use(_chaiHttp["default"]);
var _TOKEN = "";
describe("Welcome Controller", function () {
  // before(async () => {
  //   // run migrations and seeders to prepare the database
  //   await db.sequelize.sync({ force: true });
  // });

  describe("GET /welcome", function () {
    it("should return a 200 response and a welcome message", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var res;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _chai["default"].request(_server["default"]).get("/api/v1/welcome");
          case 2:
            res = _context.sent;
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal("Test controller OK");
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
  });
});
describe("Google Authentication", function () {
  var mockUser = {
    email: "johndoe@gmail.com",
    password: "12345678"
  };
  describe("GET /auth/google", function () {
    before(function () {
      // set up passport-stub to simulate authentication
      _passportStub["default"].install(_server["default"]);
    });
    after(function () {
      // uninstall passport-stub after the tests are finished
      _passportStub["default"].uninstall();
    });
    it("should redirect to Google auth page", function (done) {
      (0, _supertest["default"])(_server["default"]).get("/auth/google").expect(302) // expect a redirect
      .end(function (err, res) {
        if (err) return done(err);
        (0, _chai.assert)(res.headers.location.startsWith("https://accounts.google.com/o/oauth2/v2/auth"));
        done();
      });
    });
  });
  describe("GET /google/callback", function () {
    it("should get a Bad Request when accessing google callback with no token", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var response;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _supertest["default"])(_server["default"]).get("/google/callback");
          case 2:
            response = _context2.sent;
            expect(response.status).to.equal(302);
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })));
    it("should return a token when generateToken is called ", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var response;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _token_generator["default"])(mockUser);
          case 2:
            response = _context3.sent;
            expect(response).to.be.a("string");
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })));
  });
  describe("serializeUser", function () {
    it("should serialize user object", function (done) {
      var user = {
        id: 123,
        name: "John Doe"
      };
      _passport["default"].serializeUser(function (user, done) {
        done(null, user);
      });
      _passport["default"].serializeUser(user, function (err, serializedUser) {
        if (err) return done(err);
        _chai.assert.deepEqual(serializedUser, user);
        done();
      });
    });
  });
});
describe("generateToken", function () {
  it("should return a token when provided with valid payload", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var payload, token;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          payload = {
            email: "johndoe@gmail.com",
            password: "123"
          };
          _context4.next = 3;
          return (0, _token_generator["default"])(payload);
        case 3:
          token = _context4.sent;
          expect(token).to.be.a("string");
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it("should throw an error when provided with an invalid payload", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var payload, req, res, token;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          payload = undefined;
          req = {};
          res = {};
          _context5.prev = 3;
          _context5.next = 6;
          return (0, _token_generator["default"])(payload);
        case 6:
          token = _context5.sent;
          _context5.next = 12;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](3);
          expect(_context5.t0).to.be.an("error");
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[3, 9]]);
  })));
});
describe("login", function () {
  var user = {
    email: "johndoe@gmail.com",
    password: "12345678"
  };
  var realUser = {
    email: "boris@gmail.com",
    password: "1234"
  };
  describe("POST /api/v1/users/signin", function () {
    it("should respond with status code 200", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var response;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signin").send(realUser);
          case 2:
            response = _context6.sent;
            expect(response.status).to.equal(200);
          case 4:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    })));
    it("should throw an error if invalid credentials", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var response;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signin").send({
              email: "boris250@gmail.com",
              password: "123"
            });
          case 2:
            response = _context7.sent;
            expect(response.status).to.equal(401);
          case 4:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    })));
    it("should throw error if user does not exist ", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var response;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signin").send(user);
          case 2:
            response = _context8.sent;
            expect(response.status).to.equal(400);
          case 4:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    })));
    it("should respond with an array of users", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var loginResponse, token, response;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signin").send(realUser);
          case 2:
            loginResponse = _context9.sent;
            token = loginResponse.body.token;
            _context9.next = 6;
            return _chai["default"].request(_server["default"]).get("/api/v1/users").set("Authorization", "Bearer ".concat(token));
          case 6:
            response = _context9.sent;
            expect(response.body).to.be.an("array");
          case 8:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    })));
  });
});
describe("Set user role", function () {
  var fakeUser = {
    email: "admin@gmail.com",
    password: "password"
  };
  var unauthorisedUser = {
    //user with just buyer role
    email: "boris@gmail.com",
    password: "1234"
  };
  describe("POST /api/v1/users/signup", function () {
    it("should not create a user without full data provided", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var response;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signup").send({
              password: "1234"
            });
          case 2:
            response = _context10.sent;
            expect(response.status).to.equal(400);
          case 4:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    })));
    it("should create a fake admin", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var response;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signup").send(fakeUser);
          case 2:
            response = _context11.sent;
            expect(response.status).to.equal(200);
          case 4:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    })));
  });
  describe("PUT /api/v1/users/:id/roles", function () {
    it("should authorise the user without admin role", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var loginResponse;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signin").send(unauthorisedUser);
          case 2:
            loginResponse = _context12.sent;
            _TOKEN = loginResponse.body.token;
            expect(loginResponse.status).to.equal(200);
          case 5:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    })));
    it("should deny the unauthorised user", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var response;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _chai["default"].request(_server["default"]).put("/api/v1/users/".concat(fakeUser.email, "/roles")).set("Authorization", "Bearer ".concat(_TOKEN)).send({
              role: "seller"
            });
          case 2:
            response = _context13.sent;
            expect(response.status).to.equal(400);
          case 4:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    })));
    it("should authorise the fake admin", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
      var loginResponse;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _chai["default"].request(_server["default"]).post("/api/v1/users/signin").send(fakeUser);
          case 2:
            loginResponse = _context14.sent;
            _TOKEN = loginResponse.body.token;
            expect(loginResponse.status).to.equal(200);
          case 5:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    })));
    it("should set the role to seller", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
      var response;
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return _chai["default"].request(_server["default"]).put("/api/v1/users/".concat(fakeUser.email, "/roles")).set("Authorization", "Bearer ".concat(_TOKEN)).send({
              role: "seller"
            });
          case 2:
            response = _context15.sent;
            expect(response.status).to.equal(200);
          case 4:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    })));
  });
});
describe("PRODUCT", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
  var realUser, response, token, product, invalidproduct;
  return _regenerator["default"].wrap(function _callee20$(_context20) {
    while (1) switch (_context20.prev = _context20.next) {
      case 0:
        realUser = {
          email: "boris@gmail.com",
          password: "1234"
        };
        _context20.next = 3;
        return _chai["default"].request(_server["default"]).post("/api/v1/users/signin").send(realUser);
      case 3:
        response = _context20.sent;
        token = response.body.token;
        product = {
          productName: "test",
          categoryName: "test",
          description: "test",
          price: 100,
          quantity: 10,
          expiryDate: "12/12/12"
        };
        invalidproduct = {
          productName: "test",
          description: "test",
          price: 100,
          quantity: 10,
          expiryDate: "12/12/12"
        };
        expect(response.status).to.equal(200);
        describe("POST /api/v1/products", function () {
          it("should create a Product", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
            var response;
            return _regenerator["default"].wrap(function _callee16$(_context16) {
              while (1) switch (_context16.prev = _context16.next) {
                case 0:
                  _context16.next = 2;
                  return _chai["default"].request(_server["default"]).post("/api/v1/products").set("Authorization", "Bearer ".concat(token)).send(product);
                case 2:
                  response = _context16.sent;
                  expect(response.status).to.equal(201);
                  // expect(response.body).to.be.an('array');
                case 4:
                case "end":
                  return _context16.stop();
              }
            }, _callee16);
          })));
          it("should return 400 incase validation fails", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
            var response;
            return _regenerator["default"].wrap(function _callee17$(_context17) {
              while (1) switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return _chai["default"].request(_server["default"]).post("/api/v1/products").set("Authorization", "Bearer ".concat(token)).send(invalidproduct);
                case 2:
                  response = _context17.sent;
                  expect(response.status).to.equal(400);
                case 4:
                case "end":
                  return _context17.stop();
              }
            }, _callee17);
          })));
          it("should return 400 incase validation fails", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
            var response;
            return _regenerator["default"].wrap(function _callee18$(_context18) {
              while (1) switch (_context18.prev = _context18.next) {
                case 0:
                  _context18.next = 2;
                  return _chai["default"].request(_server["default"]).post("/api/v1/products").set("Authorization", "Bearer ".concat(token)).send(invalidproduct);
                case 2:
                  response = _context18.sent;
                  expect(response.status).to.equal(400);
                case 4:
                case "end":
                  return _context18.stop();
              }
            }, _callee18);
          })));
          it("should return 401 if user is not logged in", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
            var response;
            return _regenerator["default"].wrap(function _callee19$(_context19) {
              while (1) switch (_context19.prev = _context19.next) {
                case 0:
                  _context19.next = 2;
                  return _chai["default"].request(_server["default"]).post("/api/v1/products").send(invalidproduct);
                case 2:
                  response = _context19.sent;
                  expect(response.status).to.equal(401);
                case 4:
                case "end":
                  return _context19.stop();
              }
            }, _callee19);
          })));
        });
      case 9:
      case "end":
        return _context20.stop();
    }
  }, _callee20);
})));
describe("Disable account", function () {
  it("should disable an account", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
    var response;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return _chai["default"].request(_server["default"]).patch("/api/v1/users/eric@gmail.com/status").set("Authorization", "Bearer ".concat(_TOKEN));
        case 2:
          response = _context21.sent;
          expect(response.status).to.equal(200);
        case 4:
        case "end":
          return _context21.stop();
      }
    }, _callee21);
  })));
  it("should enable an account", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
    var response;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return _chai["default"].request(_server["default"]).patch("/api/v1/users/eric@gmail.com/status").set("Authorization", "Bearer ".concat(_TOKEN));
        case 2:
          response = _context22.sent;
          expect(response.status).to.equal(200);
        case 4:
        case "end":
          return _context22.stop();
      }
    }, _callee22);
  })));
});
//# sourceMappingURL=index.js.map