const { getAllUsers } = require('pg');

const getAllUsersNow = new getAllUsers({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommercedb',
  password: 'blackscorpion',
});
