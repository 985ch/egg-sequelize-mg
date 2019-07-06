'use strict';

const path = require('path');
const _ = require('lodash');
const Sequelize = require('sequelize');
const defaultConfig = require('./config');

async function readMysql(appRoot, config, tables) {
  const { database, username, password } = config;
  const sequelize = new Sequelize(database, username, password, config);

  if (!tables) {
    tables = await sequelize.query('SHOW TABLES', { type: sequelize.QueryTypes.SHOWTABLES });
  } else if (tables.length === 0) {
    return { tables: {}, config: defaultConfig };
  }

  const model = {};
  for (const table of tables) {
    model[table] = await readTable(sequelize, table);
  }
  await sequelize.close();

  const dir = path.join(appRoot, config.baseDir);
  const sequelizeText = 'app.' + config.delegate;
  return {
    tables: model,
    info: { dialect: config.dialect },
    config: _.assign({ dir, sequelizeText }, defaultConfig),
  };
}

async function readTable(sequelize, table) {
  const obj = {};

  const tableinfo = await sequelize.query(`SHOW FULL COLUMNS FROM ${table}`, { type: sequelize.QueryTypes.SELECT, raw: true });
  for (const field of tableinfo) {
    obj[field.Field] = {
      type: field.Type.toUpperCase(),
      allowNull: field.Null === 'YES',
      defaultValue: field.Default,
      comment: field.Comment,
      primaryKey: false,
      isSerialKey: false,
      autoIncrement: field.Extra === 'auto_increment',
    };
  }
  const primaryKeys = await sequelize.query(`SHOW INDEX FROM \`${table}\` WHERE Key_name='PRIMARY'`, { type: sequelize.QueryTypes.SELECT, raw: true });
  for (const key of primaryKeys) {
    obj[key.Column_name].primaryKey = true;
    obj[key.Column_name].isSerialKey = true;
  }
  return obj;
}

module.exports = readMysql;
