"use strict";

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var process = require('process');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config.js')[env];
var db = {};
var sequelize;
if (process.env.DEV_DATABASE_URL) {
  sequelize = new Sequelize(process.env.DEV_DATABASE_URL, config);
} else {
  sequelize = new Sequelize(config.url, config);
}
fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1;
}).forEach(function (file) {
  var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
//# sourceMappingURL=index.js.map