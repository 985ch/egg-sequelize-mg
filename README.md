# egg-sequelize-mg
![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/egg-sequelize-mg.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-sequelize-mg
[download-image]: https://img.shields.io/npm/dm/egg-sequelize-mg.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-sequelize-mg

> > This package allows the user to automatically generate the required sequelize model file based on the database configuration, based on [sequelize-mg](https://github.com/985ch/sequelize-mg) and [egg-sequelize](https://github.com/eggjs/egg-sequelize) was adapted.

### [中文说明](./README.zh_CN.md)
## Prerequisites

- node &gt;=8

## Install

```sh
npm i egg-sequelize-mg --save-dev
```
## Usage
```js
// {appRoot}/config/database/sequelize.js
'use strict';
module.exports = {
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
```
```js
// {appRoot}/tools/model-generator.js
'use strict';

const path = require('path');
const generator = require('egg-sequelize-mg');
const config = require('../config/database/sequelize');

const tables = {
  testdb: [ 'table1', 'table2' ], // If you don't want to generate all the tables in the database, configure the whitelist here.
}

// Output files to the target directory using a simple format
generator.generate(config, tables, path.join(__dirname, '../app/'), { mysql: generator.readMysql });
```
If you want to see more examples, please see [here](./test.js). If you want to configure your own file format, please go to [sequelize-mg](https://github.com/985ch/sequelize-mg)

## Run tests

```sh
npm run test
```

## Author

 **985ch**

* Github: [@985ch](https://github.com/985ch)

## License

Copyright © 2019 [985ch](https://github.com/985ch).<br />
This project is [MIT](https://github.com/985ch/egg-sequelize-mg/blob/master/LICENSE) licensed.<br />
This README was translate by [google](https://translate.google.cn)

