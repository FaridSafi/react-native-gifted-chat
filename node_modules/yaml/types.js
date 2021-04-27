const opt = require('./dist/tags/options')
exports.binaryOptions = opt.binaryOptions
exports.boolOptions = opt.boolOptions
exports.intOptions = opt.intOptions
exports.nullOptions = opt.nullOptions
exports.strOptions = opt.strOptions

exports.Schema = require('./dist/schema').Schema
exports.YAMLMap = require('./dist/schema/Map').YAMLMap
exports.YAMLSeq = require('./dist/schema/Seq').YAMLSeq
exports.Pair = require('./dist/schema/Pair').Pair
exports.Scalar = require('./dist/schema/Scalar').Scalar
