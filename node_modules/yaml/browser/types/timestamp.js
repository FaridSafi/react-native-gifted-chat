import { floatTime, intTime, timestamp } from '../dist/tags/yaml-1.1/timestamp'
export { floatTime, intTime, timestamp }
export default [intTime, floatTime, timestamp]

import { warnFileDeprecation } from './dist/warnings'
warnFileDeprecation(__filename)
