'use strict';

const path = require('path');
const _ = require('lodash');
const Sequelize = require('sequelize');
const defaultConfig = require('./config');

async function readMysql(appRoot, config, tables) {
  const { database, username, password } = config;
  const sequelize = new Sequelize(database, username, password, config);
  const tablesData = await sequelize.query(
    `SELECT TABLE_NAME AS name,TABLE_COMMENT AS comment FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='${database}' AND TABLE_TYPE='BASE TABLE'`,
    { type: sequelize.QueryTypes.SELECT, raw: true }
  );

  if (!tables) {
    tables = tablesData;
  } else {
    const tablesInfo = _.keyBy(tablesData, 'name');
    tables = _.map(tables, tableName => tablesInfo[tableName]);
  }
  if (tables.length === 0) {
    return { tables: {}, config: defaultConfig };
  }

  const model = {};
  for (const table of tables) {
    model[table.name] = await readTable(sequelize, table);
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
  const columns = {};

  const tableinfo = await sequelize.query(`SHOW FULL COLUMNS FROM ${table.name}`, { type: sequelize.QueryTypes.SELECT, raw: true });
  for (const field of tableinfo) {
    columns[field.Field] = {
      type: field.Type.toUpperCase(),
      allowNull: field.Null === 'YES',
      defaultValue: field.Default,
      comment: field.Comment,
      primaryKey: false,
      uniqueKey: false,
      isSerialKey: false,
      autoIncrement: field.Extra === 'auto_increment',
    };
  }
  const keyGroups = {};
  const keys = await sequelize.query(`SHOW INDEX FROM \`${table.name}\``, { type: sequelize.QueryTypes.SELECT, raw: true });
  for (const key of keys) {
    const kname = key.Key_name;
    const cname = key.Column_name;

    if (kname === 'PRIMARY') {
      columns[cname].primaryKey = true;
      columns[cname].isSerialKey = true;
    } else if (key.Non_unique === 0) {
      columns[cname].uniqueKey = kname;
    }
    if (keyGroups[kname]) {
      keyGroups[kname].keys.push(cname);
    } else {
      keyGroups[kname] = {
        unique: key.Non_unique === 0,
        keys: [ cname ],
      };
    }
  }
  return {
    columns,
    comment: table.comment || ' No comment for this table',
    keys: keyGroups,
  };
}

module.exports = readMysql;
