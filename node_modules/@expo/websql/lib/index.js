'use strict';

var SQLiteDatabase = require('./sqlite/SQLiteDatabase');
var customOpenDatabase = require('./custom');

module.exports = customOpenDatabase(SQLiteDatabase);