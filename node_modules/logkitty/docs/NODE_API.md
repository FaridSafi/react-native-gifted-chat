# Node API

## Example

```ts
import {
  logkitty,
  makeTagsFilter,
  formatEntry,
  formatError,
  Priority,
  Entry,
} from 'logkitty';

const emitter = logkitty({
  platform: 'android',
  minPriority: Priority.VERBOSE,
  filter: makeTagsFilter('ReactNative', 'ReactNativeJS'),
});

emitter.on('entry', (entry: Entry) => {
  console.log(formatEntry(entry));
});

emitter.on('error', (error: Error) => {
  console.log(formatError(error));
});
```

## API

#### `logkitty(options: LogkittyOptions): EventEmitter`

Spawns logkitty with given options:

* `platform: 'android' | 'ios'` - Platform to get the logs from: uses `adb logcat` for Android and `xcrun simctl` + `log` for iOS simulator`.
* `adbPath?: string` - Custom path to adb tool or `undefined` (used only when `platform` is `android`).
* `priority?: number` - Minimum priority of entries to show of `undefined`, which will include all entries with priority **DEBUG** (Android)/**DEFAULT** (iOS) or above.
* `filter?: FilterCreator` - The returned value from `makeTagsFilter`/`makeAppFilter`/`makeMatchFilter`/`makeCustomFilter` or `undefined`, which will include all entries (similar to `all` command in the CLI).

When spawning logkitty you will get a instance of `EventEmitter` which emits the following events:

* `entry` (arguments: `entry: Entry`) - Emitted when new log comes in, that matches the `filter` and `priority` options. It is your responsibility to print or use that entry, for example you can use `formatEntry` to print it with the same styling as in the CLI.
* `error` (arguments: `error: Error`) - Emitted when the log can't be parsed into a entry or when the Logcat process emits an error. You can use `formatError` to print it with the same styling as in the CLI.

#### `makeTagsFilter(...tags: string[]): FilterCreator`

Available for both Android and iOS.

Creates a filter from given tags (for example `ReactNative`, `ReactNativeJS`), so only entries matching any of the given tags will be emitted in `entry` event. Pass the returned value to `filter` property when running `logkitty`.

#### `makeAppFilter(appIdentifier: string): FilterCreator`

__Available only for Android.__

Creates a filter for given application identifier (for example `com.example.app`), so only entries from given app will be emitted in `entry` event. Pass the returned value to `filter` property when running `logkitty`.

#### `makeMatchFilter(...regexes: RegExp[]): FilterCreator`

Available for both Android and iOS.

Creates a filter from given regexes (for example `/ReactNative/gm`, `/ReactNativeJS/gm`), so only entries matching any of the given regexes will be emitted in `entry` event. Pass the returned value to `filter` property when running `logkitty`.

#### `makeCustomFilter(...patterns: string[]): FilterCreator`

__Available only for Android.__

Creates a custom filter (for example `*:S`, `ReactNative:D`, `Hello:E`), so only entries matching given patterns will be emitted in `entry` event. Pass the returned value to `filter` property when running `logkitty`.

#### `formatEntry(entry: Entry): string`

Takes an entry as formats it to a string with ANSI escape codes for coloring.

#### `formatError(error: Error): string`

Takes an error and formats it to a string with ANSI escape codes for coloring.
