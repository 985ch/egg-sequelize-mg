'use strict';

const sequelizeGen = require('sequelize-mg');

const { readMysql } = require('./lib/readmysql');
const sachikawaMysql = require('./lib/sachikawa-mysql');
const { defaultConfig, getConfig } = require('./lib/config');

async function generate(config, tables, appRoot = './', reader) {
  if (!reader)reader = require('./lib/readdefault');
  let total = { ignore: 0, update: 0, create: 0 };
  if (!config.datasources) {
    const result = await reader(appRoot, getConfig(config, appRoot), tables);
    total = await sequelizeGen(result.tables, result.info, result.config);
  } else {
    tables = tables || {};

    for (const cfg of config.datasources) {
      const result = await reader(appRoot, getConfig(cfg, appRoot), tables[cfg.delegate]);
      const { ignore, update, create } = await sequelizeGen(result.tables, result.info, result.config);
      total.ignore += ignore;
      total.update += update;
      total.create += create;
    }
  }
  console.log(`ignore files:${total.ignore}\nupdate files:${total.update}\ncreate files:${total.create}`);
}

module.exports = {
  generate,
  readMysql,
  sachikawaMysql,
  config: defaultConfig,
};
