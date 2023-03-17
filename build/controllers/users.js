"use strict";

var _require = require('pg'),
  getAllUsers = _require.getAllUsers;
var getAllUsersNow = new getAllUsers({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommercedb',
  password: 'blackscorpion'
});
//# sourceMappingURL=users.js.map