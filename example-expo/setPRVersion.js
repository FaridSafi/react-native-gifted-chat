#!/usr/bin/env node

/* eslint-disable */

const fs = require('fs')
const pkg = require('./package.json')

pkg.dependencies['react-native-gifted-chat'] = process.env.BRANCH

fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), 'utf8')

process.exit()
