'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const { getTables, readTable } = require('./readmysql');
const { getConfig } = require('./config');

// 默认文件头
const fileHead = `'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
`;

// 默认文件尾
const fileTail = `
  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
`;

// egg-sachikawa框架的mysql数据模型构造器
function shachikawaMysql(docJson) {
  return async function(appRoot, config, tableList) {
    // 获取数据表
    const { database, username, password } = config;
    const sequelize = new Sequelize(database, username, password, config);
    const tables = await getTables(sequelize, database, tableList);

    // 构造数据模型
    const model = {};
    for (const table of tables) {
      const name = table.name;
      if (name.toUpperCase() === 'COMMENT') { // comment表作为特殊注释表单独读取全表数据
        if (docJson) {
          docJson.comments = await sequelize.query('SELECT * FROM COMMENT', { type: sequelize.QueryTypes.SELECT, raw: true });
        }
      }
      if (/^[a-zA-Z]{1}/.test(name)) { // 不以字母开头的表全部忽略
        model[name] = await readTable(sequelize, table);
      }
    }
    await sequelize.close();

    // 返回构造配置
    const resCfg = getConfig(config, appRoot, {
      fileHead,
      fileTail,
    });
    if (docJson) {
      resCfg.notice = onDocNotice(database, docJson);
    }
    return {
      tables: model,
      info: { dialect: config.dialect },
      config: resCfg,
    };
  };
}

// 处理文档通知对象
function onDocNotice(dbName, docJson) {
  const dbObj = _.set(docJson, [ 'databases', dbName ], _.get(docJson, [ 'databases', dbName ], {}));

  return (tableName, table, flag) => {
    // 生成注释对象
    const { group, comment } = getTableComment(table.comment);
    dbObj[tableName] = {
      group,
      comment,
      ignore: flag === 'ignore',
      columns: table.columns,
      keys: table.keys,
    };
  };
}

// 将表注释拆解为分组和注释两块
function getTableComment(comment) {
  let group = null;
  if (comment[0] === '#') {
    const idx = comment.indexOf('#', 1);
    if (idx >= 0) {
      group = comment.substring(1, idx);
      comment = comment.substring(idx + 1);
    }
  }
  return { group, comment };
}

module.exports = shachikawaMysql;
