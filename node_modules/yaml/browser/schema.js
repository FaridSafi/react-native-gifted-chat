import { Schema } from './dist/schema'
import { nullOptions, strOptions } from './dist/tags/options'
import { stringifyString } from './dist/stringify'

Schema.nullOptions = nullOptions
Schema.strOptions = strOptions
Schema.stringify = stringifyString
export { Schema as default }
export { nullOptions, strOptions, stringifyString as stringify }

import { warnFileDeprecation } from './dist/warnings'
warnFileDeprecation(__filename)
