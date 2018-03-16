#!/usr/bin/env node

/* eslint-disable */

const fs = require('fs');
const pkg = require('./package.json');
const app = require('./app.json');
const { TRAVIS_BUILD_NUMBER, BRANCH } = process.env;

pkg.dependencies['react-native-gifted-chat'] = BRANCH;
app.expo['version'] = `${pkg.version}.${TRAVIS_BUILD_NUMBER || 'dev'}`;

fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 1), 'utf8');
fs.writeFileSync('./app.json', JSON.stringify(app, null, 1), 'utf8');

process.exit();
