'use strict';

const path = require('path');
const _ = require('lodash');
const AutoSequelize = require('sequelize-auto');
const cfg = require('./config');

async function readDefault(appRoot, config, tables) {
  const { database, username, password } = config;
  const auto = new AutoSequelize(database, username, password, _.assign({}, config, {
    directory: false,
    tables,
  }));
  const data = await auto.run();

  const tablesInfo = {};
  for (const tableName in data.tables) {
    const table = data.tables[tableName];
    for (const fieldName in table) {
      const field = table[fieldName];
      field.isSerialKey = field.foreignKey;
    }
    tablesInfo[tableName] = { columns: table, comment: '' };
  }

  const dir = path.join(appRoot, config.baseDir);
  const sequelizeText = 'app.' + config.delegate;

  return {
    tables: tablesInfo,
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
