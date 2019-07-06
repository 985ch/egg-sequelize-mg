'use strict';

const _ = require('lodash');

const fileHead = `'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;
`;

const fileTail = `
  model.associate = function() {
  };

  return model;
};
`;

function gt(table, fields, info, config) {
  const { camelCase, sequelizeText } = config;
  const tableName = camelCase ? _.camelCase(table) : table;
  const tableHead = `  const model = ${sequelizeText}.define('${tableName}', {
`;
  const tableTail = `  }, {
    tableName: '${tableName}',
  });`;
  return tableHead + fields + tableTail;
}

function spaces(n) {
  let t = '';
  for (let i = 0; i < n; i++) {
    t += '  ';
  }
  return t;
}

function f2t(table, field, obj, info, config) {
  const { lf, camelCase } = config;
  const { defaultValText, primaryKey, allowNull, typeText, autoIncrement, comment } = obj;
  const fieldName = camelCase ? _.camelCase(field) : field;
  let text = spaces(2) + fieldName + ': {';


  text += ' type: DataTypes.' + typeText;
  text += ', allowNull: ' + allowNull;
  if (defaultValText) {
    text += ', defaultValue: ' + defaultValText;
  }
  if (primaryKey) {
    text += ', primaryKey: true';
  }
  if (autoIncrement) {
    text += ', autoIncrement: true';
  }
  if (camelCase) {
    text += ", field: '" + field + "'";
  }

  text += ' },' + (comment ? ' // ' + comment : '') + lf;
  return text;
}

module.exports = {
  gt,
  f2t,
  fileHead,
  fileTail,
};
