'use strict';

const generator = require('./');

const config = {
  datasources: [{
    delegate: 'maindb',
    baseDir: 'model/main',
    database: 'main',
    dialect: 'mysql',
    username: 'root',
    password: 'root',
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    },
  }, {
    delegate: 'testdb',
    baseDir: 'model/test',
    database: 'test',
    dialect: 'mysql',
    username: 'root',
    password: 'root',
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    },
  }],
};

const tables = {
  qqbotdb: [ 'map', 'skills' ],
};

(async function() {
  await generator.generate(config, tables, './sample/test1/', { mysql: generator.readMysql });
  await generator.generate(config, tables, './sample/test2/');
  await generator.generate(config.datasources[0], [ 'users' ], './sample/test3/');
})();

