# [tezos-sign](https://github.com/yugasun/tezos-sign)

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yugasun/tezos-sign/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/yugasun/tezos-sign.svg?branch=master)](https://travis-ci.org/yugasun/tezos-sign)
[![NPM downloads](http://img.shields.io/npm/dm/tezos-sign.svg?style=flat-square)](http://www.npmtrends.com/tezos-sign)

English | [简体中文](./README.zh-CN.md)

Offline sign tool for [tezos](https://tezos.com/) divided from [eztz](https://github.com/TezTech/eztz)

## Directory

```
.
├── demo use demo
├── dist build output dir
├── doc docs
├── src source code
├── test unit test
├── CHANGELOG.md change log
└── TODO.md todo
```

## Usage Guide

Install by npm:

```bash
$ npm install --save tezos-sign
```

For node:

```js
var TezosSign = require('tezos-sign');
```

For webpack:

```js
import TezosSign from 'tezos-sign';
```

## Demo

```js
import TezosSign from 'tezos-sign';

// sign transaction
// opbytes is operation bytes
// privateKey is your account private key
const siged = TezosSign.sign(opbytes, privateKey);

// generate transaction hash
// sopbytes = signed.sbytes
const hash = TezosSign.generateTxHash(sopbytes);

// generate keys
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

// generate keys without seed
const keysNoSeed = TezosSign.generateKeysNoSeed();
/*
keysNoSeed {
    sk: 'private key',
    pk: 'public key',
    pkh: 'address',
}
*/

// extract keys
const extractKeys = TezosSign.extractKeys(keys.sk);
/*
extractKeys {
    sk: 'private key',
    pk: 'public key',
    pkh: 'address',
}
*/

```

## Develop

Install dependencies:

```bash
$ npm install
```

Build:

```bash
$ npm run build
```

Unit test:

```bash
$ npm test
```

Modify version in `package.json`, `README.md`, and release it

```bash
$ npm run release
```

Npm publish:

```bash
$ npm publish
```

## License

[MIT](./LICENSE)