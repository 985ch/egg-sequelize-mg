'use strict';

const _ = require('lodash');
const AutoSequelize = require('sequelize-auto');
const { getConfig } = require('./config');

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

  return {
    tables: tablesInfo,
    info: { dialect: config.dialect },
    config: getConfig(config, appRoot),
  };
}

module.exports = readDefault;
