import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import { env as _env } from 'process';

const basename = _basename(__filename);
const env = _env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

let sequelize;
if (_env.DEV_DATABASE_URL) {
  sequelize = new Sequelize(_env.DEV_DATABASE_URL, config);
} else {
  sequelize = new Sequelize(config.url, config);
}

readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0
      && file !== basename
      && file.slice(-3) === '.js'
      && file.indexOf('.test.js') === -1
  ))
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const model = require(join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
