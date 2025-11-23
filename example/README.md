# How to use

1. Install dependencies:

   ```bash
   yarn install
   cd example
   yarn install
   ```

2. Install iOS dev build (only needed once or after rebuilding native dependencies):
   ```bash
   yarn installDevBuild:ios
   ```

   or

   ```bash
   yarn installDevBuild:android
   ```

3. Start metro bundler:

   ```bash
   yarn start
   ```

4. Switch to development build:

Press `s` in terminal with metro

5. Start the example app on iOS simulator:

   ```bash
   yarn ios:start
   ```

# Dark Theme Support

To switch theme press `Cmd + Shift + A` in iOS simulator.
