'use strict';

const sequelizeGen = require('sequelize-mg');

const readMysql = require('./lib/readmysql');
const readDefault = require('./lib/readdefault');
const defaultConfig = require('./lib/config');

async function generate(config, tables, appRoot = './', reader = readDefault) {
  if (!config.datasources) {
    const result = await reader(appRoot, config, tables);
    await sequelizeGen(result.tables, result.info, result.config);
  } else {
    tables = tables || {};
    for (const cfg of config.datasources) {
      const result = await reader(appRoot, cfg, tables[cfg.delegate]);
      await sequelizeGen(result.tables, result.info, result.config);
    }
  }
}

module.exports = {
  generate,
  readMysql,
  readDefault,
  config: defaultConfig,
};
