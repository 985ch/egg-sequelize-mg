'use strict';

const path = require('path');
const _ = require('lodash');
const util = require('util');
const AutoSequelize = require('sequelize-auto');
const cfg = require('./config');

async function readDefault(appRoot, config, tables) {
  const { database, username, password } = config;
  const auto = new AutoSequelize(database, username, password, _.assign({}, config, {
    directory: false,
    tables,
  }));
  const run = util.promisify(callback => {
    auto.run(err => {
      callback(err);
    });
  });
  await run();

  for (const tableName in auto.tables) {
    for (const fieldName in auto.tables[tableName]) {
      const field = auto.tables[tableName][fieldName];
      field.isSerialKey = field.foreignKey && _.isFunction(auto.dialect.isSerialKey) && auto.dialect.isSerialKey(field.foreignKey);
    }
  }

  const dir = path.join(appRoot, config.baseDir);
  const sequelizeText = 'app.' + config.delegate;

  return {
    tables: auto.tables,
    info: { dialect: config.dialect },
    config: {
      dir,
      sequelizeText,
      gt: cfg.gt,
      fileHead: cfg.fileHead,
      fileTail: cfg.fileTail,
    },
  };
}

module.exports = readDefault;
