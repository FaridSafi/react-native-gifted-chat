/*
 * Maintenance notice shown when react-native-gifted-chat is installed.
 *
 * This only prints a message - no network calls, no telemetry. It must never
 * fail an install, so everything is wrapped and the process always exits 0.
 * Silence it with GIFTED_CHAT_NO_NOTICE=1 (or npm install --ignore-scripts).
 *
 * .cjs because the package is "type": "module" - this needs CommonJS for
 * require/__dirname.
 */
'use strict'

try {
  const path = require('path')

  const initCwd = process.env.INIT_CWD || process.cwd()
  const isOwnRepoInstall = path.resolve(initCwd) === path.resolve(__dirname)
  const silenced =
    process.env.GIFTED_CHAT_NO_NOTICE === '1' ||
    process.env.CI === 'true' ||
    process.env.NODE_ENV === 'production'

  if (!isOwnRepoInstall && !silenced) {
    // stderr is synchronous (stdout to a pipe can be lost on immediate exit)
    const color = process.stderr.isTTY
      ? { y: '\x1b[33m', c: '\x1b[36m', b: '\x1b[1m', r: '\x1b[0m' }
      : { y: '', c: '', b: '', r: '' }

    const lines = [
      '',
      `${color.y}${color.b}▲  react-native-gifted-chat is now in maintenance mode${color.r}`,
      '',
      '   Active development has moved to a maintained fork:',
      `   ${color.c}${color.b}@kesha-antonov/react-native-chat${color.r}`,
      `   ${color.c}https://www.npmjs.com/package/@kesha-antonov/react-native-chat${color.r}`,
      '',
      '   • Adds streaming AI messages + the latest fixes',
      '   • Migrating is mostly a rename (GiftedChat → Chat)',
      '',
    ]

    process.stderr.write(lines.join('\n') + '\n')
  }
} catch (_) {
  // Never let a notice break an install.
}
