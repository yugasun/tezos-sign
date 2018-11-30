# [tezos-sign](https://github.com/yugasun/tezos-sign)

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yugasun/tezos-sign/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/yugasun/tezos-sign.svg?branch=master)](https://travis-ci.org/yugasun/tezos-sign)
[![NPM downloads](http://img.shields.io/npm/dm/tezos-sign.svg?style=flat-square)](http://www.npmtrends.com/tezos-sign)

[English](./README.md) | 简体中文

[tezos](https://tezos.com/) 区块链的离线签名工具（从 [eztz](https://github.com/TezTech/eztz) 分离出来的）。

## 目录介绍

```
.
├── demo 使用demo
├── dist 编译产出代码
├── doc 项目文档
├── src 源代码目录
├── test 单元测试
├── CHANGELOG.md 变更日志
└── TODO.md 计划功能
```

## 使用者指南

通过npm下载安装代码

```bash
$ npm install --save tezos-sign
```

如果你是node环境

```js
var TezosSign = require('tezos-sign');
```

如果你是webpack等环境

```js
import TezosSign from 'tezos-sign';
```

## 示例

```js
import TezosSign from 'tezos-sign';

// 签名交易
// opbytes 是交易生成字节数据
// privateKey 私钥
const siged = TezosSign.sign(opbytes, privateKey);

// 生成交易hash
// sopbytes 是签名结果中的 sbytes
const hash = TezosSign.generateTxHash(sopbytes);

// 生成公私钥对
const keys = TezosSign.generateKeys('yugasun');
/*
keys {
    mnemonic: 'memory key words',
    passphrase: 'yugasun',
    sk: 'private key',
    pk: 'public key',
    pkh: 'address',
}
*/

// 生成不带助记词的公私钥对
const keysNoSeed = TezosSign.generateKeysNoSeed();
/*
keysNoSeed {
    sk: 'private key',
    pk: 'public key',
    pkh: 'address',
}
*/

// 解析私钥
const extractKeys = TezosSign.extractKeys(keys.sk);
/*
extractKeys {
    sk: 'private key',
    pk: 'public key',
    pkh: 'address',
}
*/

```

## 开发

首次运行需要先安装依赖

```bash
$ npm install
```

一键打包生成生产代码

```bash
$ npm run build
```

运行单元测试

```bash
$ npm test
```

修改package.json中的版本号，修改README.md中的版本号，修改CHANGELOG.md，然后发布新版

```bash
$ npm run release
```

将新版本发布到npm

```bash
$ npm publish
```

## License

[MIT](./LICENSE)