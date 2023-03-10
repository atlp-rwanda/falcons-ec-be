"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = exports.production = exports.development = void 0;
require('dotenv').config();
var development = {
  url: process.env.DEV_DATABASE_URL,
  dialect: 'postgres'
};
exports.development = development;
var test = {
  url: process.env.TEST_DATABASE_URL,
  dialect: 'postgres'
};
exports.test = test;
var production = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres'
};
exports.production = production;
//# sourceMappingURL=config.js.map