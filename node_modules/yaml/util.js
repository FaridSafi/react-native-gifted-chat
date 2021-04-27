exports.findPair = require('./dist/schema/Map').findPair
exports.parseMap = require('./dist/schema/parseMap').parseMap
exports.parseSeq = require('./dist/schema/parseSeq').parseSeq

const str = require('./dist/stringify')
exports.stringifyNumber = str.stringifyNumber
exports.stringifyString = str.stringifyString
exports.toJSON = require('./dist/toJSON').toJSON
exports.Type = require('./dist/constants').Type

const err = require('./dist/errors')
exports.YAMLError = err.YAMLError
exports.YAMLReferenceError = err.YAMLReferenceError
exports.YAMLSemanticError = err.YAMLSemanticError
exports.YAMLSyntaxError = err.YAMLSyntaxError
exports.YAMLWarning = err.YAMLWarning
