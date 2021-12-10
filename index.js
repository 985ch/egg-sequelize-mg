'use strict';

const sequelizeGen = require('sequelize-mg');

const { readMysql } = require('./lib/readmysql');
const sachikawaMysql = require('./lib/sachikawa-mysql');
const { defaultConfig } = require('./lib/config');

async function generate(config, tables, appRoot = './', readers) {
  if (!readers) {
    readers = {
      all: require('./lib/readdefault'),
    };
  }
  let total = { ignore: 0, update: 0, create: 0 };
  const ignoreList = [];
  if (!config.datasources) {
    const reader = readers[config.dialect] || readers.all;
    if (reader) {
      const result = await reader(appRoot, config, tables);
      total = await sequelizeGen(result.tables, result.info, result.config);
    } else {
      ignoreList.push(config.delegate);
    }
  } else {
    tables = tables || {};

    for (const cfg of config.datasources) {
      const reader = readers[cfg.dialect] || readers.all;
      if (reader) {
        const result = await reader(appRoot, cfg, tables[cfg.delegate]);
        const { ignore, update, create } = await sequelizeGen(result.tables, result.info, result.config);
        total.ignore += ignore;
        total.update += update;
        total.create += create;
      } else {
        ignoreList.push(cfg.delegate);
      }
    }
  }
  if (ignoreList.length > 0)console.log(`ignore databases:${ignoreList.join(',')}`);
  console.log(`ignore files:${total.ignore}\nupdate files:${total.update}\ncreate files:${total.create}`);
}

module.exports = {
  generate,
  readMysql,
  sachikawaMysql,
  config: defaultConfig,
};
