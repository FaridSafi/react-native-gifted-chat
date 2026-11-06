// Dev-only, once-per-session notice that this package is in maintenance mode.
// The postinstall notice is often hidden (npm 7+ hides dependency script
// output, pnpm 10 and bun skip untrusted scripts), so this is the place most
// developers actually see it. Never shown in production builds or under Jest.

const FORK = 'https://github.com/kesha-antonov/react-native-chat'
const MIGRATION_GUIDE = `${FORK}/blob/main/docs/MIGRATION.md`

let isShown = false

declare const __DEV__: boolean | undefined
declare const process: { env?: Record<string, string | undefined> } | undefined

const isDev = () => typeof __DEV__ !== 'undefined' && __DEV__

const isTest = () =>
  typeof process !== 'undefined' &&
  (process.env?.NODE_ENV === 'test' || process.env?.JEST_WORKER_ID !== undefined)

/**
 * Turns off the dev-only maintenance notice. Call it once, before the first
 * GiftedChat render (for example next to your app's root component).
 */
export function disableMaintenanceNotice () {
  isShown = true
}

export function showMaintenanceNotice () {
  if (isShown || !isDev() || isTest())
    return

  isShown = true

  console.warn(
    '[react-native-gifted-chat] This package is in maintenance mode and won\'t get new features. ' +
    'Active development continues in @kesha-antonov/react-native-chat ' +
    '(same API, streaming AI messages, latest fixes): ' + FORK + '\n' +
    'Migrating is mostly a rename (GiftedChat to Chat): ' + MIGRATION_GUIDE + '\n' +
    'Hide this message with disableMaintenanceNotice() from react-native-gifted-chat.'
  )
}
