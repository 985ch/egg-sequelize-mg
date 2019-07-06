# egg-sequelize-mg
![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/egg-sequelize-mg.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-sequelize-mg
[download-image]: https://img.shields.io/npm/dm/egg-sequelize-mg.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-sequelize-mg

> 这个包允许用户根据数据库配置自动生成所需的sequelize数据模型文件，项目基于[sequelize-mg](https://github.com/985ch/sequelize-mg)，并对[egg-sequelize](https://github.com/eggjs/egg-sequelize)进行了适配。

## 需求

- node &gt;=8

## 安装

```sh
npm i egg-sequelize-mg --save-dev
```
## 使用方法
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
  testdb: [ 'table1', 'table2' ], // 如果你不想导入数据库的所有表，就在这里配置白名单
}

// 使用简易格式输出文件到指定目录
generator.generate(config, tables, path.join(__dirname, '../app/'), generator.readMysql);
```
如果你想看更多的使用例子请看[这里](./test.js)，如果你想要配置自己的文件格式请移步[sequelize-mg](https://github.com/985ch/sequelize-mg)

## 执行测试脚本

```sh
npm run test
```

## 作者

 **985ch**

* Github: [@985ch](https://github.com/985ch)

## License

Copyright © 2019 [985ch](https://github.com/985ch).<br />
This project is [MIT](https://github.com/985ch/egg-sequelize-mg/blob/master/LICENSE) licensed.
