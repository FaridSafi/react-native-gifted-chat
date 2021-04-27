[![npm version](https://badge.fury.io/js/jsc-android.svg)](https://badge.fury.io/js/jsc-android)
[![CircleCI](https://circleci.com/gh/react-native-community/jsc-android-buildscripts.svg?style=svg)](https://circleci.com/gh/react-native-community/jsc-android-buildscripts)

# JSC build scripts for Android

The aim of this project is to provide maintainable build scripts for the [JavaScriptCore](https://www.webkit.org) JavaScript engine and allow the [React Native](https://github.com/facebook/react-native) project to incorporate up-to-date releases of JSC into the framework on Android.

This project is based on [facebook/android-jsc](https://github.com/facebook/android-jsc) but instead of rewriting JSC's build scripts into BUCK files, it relies on CMake build scripts maintained in a GTK branch of WebKit maintained by the WebKitGTK team (great work btw!). Thanks to that, with just a small amount of work we should be able to build not only current but also future releases of JSC. An obvious benefit for everyone using React Native is that this will allow us to update JSC for React Native on Android much more often than before (note that [facebook/android-jsc](https://github.com/facebook/android-jsc) uses JSC version from Nov 2014), which is especially helpful since React Native on iOS uses the built-in copy of JSC that is updated with each major iOS release (see [this](https://opensource.apple.com/) as a reference).

## Requirements

* Homebrew (https://brew.sh/)
* GNU coreutils `brew install coreutils`
* Node `brew install node`
* Java 8: `brew tap caskroom/versions && brew cask install java8`
* Android SDK: `brew cask install android-sdk`
  * Run `sdkmanager --list` and install all platforms, tools, buildtool v28.0.3, cmake (android images are not needed)
  * Set `$ANDROID_HOME` to the correct path (in ~/.bashrc or similar)
  * Set `export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools/bin`
* Android NDK r17c: download from [NDK Archives](https://developer.android.com/ndk/downloads/older_releases.html)
  * Set `export ANDROID_NDK=/path/to/android-ndk-r17c`
* Make sure you have Ruby (>2.3), Python (>2.7), Git, SVN, gperf

## Build instructions

1. Clone this repo
2. `npm run clean` will clean everything (artifacts, downloaded sources)
3. Update the version in package.json. The version will be printed by JSC lib as soon as it loads.
3. Update the config section under `package.json` to the desired build configuration
4. Update patches if needed (don't forget to update the `printVersion` patch in jsc.patch)
5. `npm run download`: downloads all needed sources
6. `npm run start`: builds jsc (this might take some time...)

The zipfile containing the android-jsc AAR will be available at `/dist`.
The library is packaged as a local Maven repository containing AAR files that include the binaries.

## Distribution

JSC library built using this project is distributed over npm: [npm/jsc-android](https://www.npmjs.com/package/jsc-android).
The library is packaged as a local Maven repository containing AAR files that include the binaries.
Please refer to the section below in order to learn how your app can consume this format.

On load, JSC prints the version out to logcat, under "JavaScriptCore.Version" tag.

## How to use it with my React Native app

Follow steps below in order for your React Native app to use new version of JSC VM on android:

### For React Native version 0.60 and newer

1. Update `jsc-android`:

```
yarn add jsc-android

# Or if you would like to try latest version
# yarn add 'jsc-android@canary`

```

2. You're done, rebuild your app and enjoy updated version of JSC on android!

### For React Native version 0.59

1. Add `jsc-android` to the "dependencies" section in your `package.json`:
```diff
dependencies {
+  "jsc-android": "241213.x.x",
```

then run `npm install` or `yarn` (depending on which npm client you use) in order for the new dependency to be installed in `node_modules`

2. Modify `android/build.gradle` file to add the new local maven repository packaged in the `jsc-android` package to the search path:
```diff
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
+       maven {
+           // Local Maven repo containing AARs with JSC library built for Android
+           url "$rootDir/../node_modules/jsc-android/dist"
+       }
    }
}
```

3. Update your app's `build.gradle` file located in `android/app/build.gradle` to add the JSC dependency.  Please make sure the dependency is before the React Native dependency.

```diff

dependencies {
+   // Make sure to put android-jsc at the top
+   implementation "org.webkit:android-jsc:r241213"
+
    compile fileTree(dir: "libs", include: ["*.jar"])
    implementation "com.android.support:appcompat-v7:${rootProject.ext.supportLibVersion}"
    implementation "com.facebook.react:react-native:+"  // From node_modules
}
```

4. Update your app's `build.gradle` file located in `android/app/build.gradle` to use first matched JSC library.

```diff
android {
    // ...
+   packagingOptions {
+       pickFirst '**/libjsc.so'
+       pickFirst '**/libc++_shared.so'
+    }
}
```

5. You're done - rebuild your app and enjoy the updated version of JSC on Android!

### For React Native version 0.58 below

1. Add `jsc-android` to the "dependencies" section in your `package.json`:
```diff
dependencies {
+  "jsc-android": "241213.x.x",
```

then run `npm install` or `yarn` (depending which npm client you use) in order for the new dependency to be installed in `node_modules`

2. Modify `android/build.gradle` file to add new local maven repository packaged in the `jsc-android` package to the search path:
```diff
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
+       maven {
+           // Local Maven repo containing AARs with JSC library built for Android
+           url "$rootDir/../node_modules/jsc-android/dist"
+       }
    }
}
```

3. Update your app's `build.gradle` file located in `android/app/build.gradle` to force app builds to use new version of the JSC library as opposed to the version specified in [react-native gradle module as a dependency](https://github.com/facebook/react-native/blob/e8df8d9fd579ff14224cacdb816f9ff07eef978d/ReactAndroid/build.gradle#L289):

```diff
}

+configurations.all {
+    resolutionStrategy {
+        force 'org.webkit:android-jsc:r241213'
+    }
+}

dependencies {
    compile fileTree(dir: "libs", include: ["*.jar"])
+   // ...
+   implementation 'org.webkit:android-jsc-cppruntime:+'
+   // For even older gradle
+   // compile 'org.webkit:android-jsc-cppruntime:+'
```

4. You're done, rebuild your app and enjoy updated version of JSC on android!

### International variant
International variant includes ICU i18n library and necessary data allowing to use e.g. Date.toLocaleString and String.localeCompare that give correct results when using with locales other than en-US. Note that this variant is about 6MiB larger per architecture than default.

To use this variant instead replace the third installation step with:

For React Native version 0.60 and newer, your build.gradle should have a flag to enable this feature.

```diff
  /**
   * Use the international variant of JavaScriptCore
   * This variant includes the ICU i18n library to make APIs like `Date.toLocaleString`
   * and `String.localeCompare` work when using with locales other than en-US.
   * Note that this variant is about 6MiB larger per architecture than the default.
   */
-  def useIntlJsc = false
+  def useIntlJsc = true
```

For React Native version 0.59, replace original artifact id with `android-jsc-intl`

```diff

dependencies {
+   // Make sure to put android-jsc at the the first
+   implementation "org.webkit:android-jsc-intl:r241213"
+
    compile fileTree(dir: "libs", include: ["*.jar"])
    implementation "com.android.support:appcompat-v7:${rootProject.ext.supportLibVersion}"
    implementation "com.facebook.react:react-native:+"  // From node_modules
}
```

For React Native version 0.58 below, replace original `resolutionStrategy` with this.

```diff
+configurations.all {
+    resolutionStrategy {
+        eachDependency { DependencyResolveDetails details ->
+            if (details.requested.name == 'android-jsc') {
+                details.useTarget group: details.requested.group, name: 'android-jsc-intl', version: 'r241213'
+            }
+        }
+    }
+}
```

## Testing

See **[Measurements](/measure)** page that contains synthetic perf test results for the most notable versions of JSC we have tried.

## Troubleshooting

Compile errors of the sort:
```shell
More than one file was found with OS independent path 'lib/armeabi-v7a/libgnustl_shared.so'
```

Add the following to your `app/build.gradle`, under `android`:

```groovy
packagingOptions {
    pickFirst '**/libgnustl_shared.so'
}
```

## Resources
- [WebkitGTK Sources](https://svn.webkit.org/repository/webkit/releases/WebKitGTK/)
- [ICU Sources](https://android.googlesource.com/platform/external/icu/)
- [Info about Webkit Revisions](https://trac.webkit.org/browser/webkit/releases/WebKitGTK)
- [Info about JSC version used on iOS](https://trac.webkit.org/browser/webkit/releases/WebKitGTK/webkit-2.18.2/Source/WebCore/Configurations/Version.xcconfig)

## Credits

Check [the list of contributors here](https://github.com/react-community/jsc-android-buildscripts/graphs/contributors). This project is supported by:


[![expo](https://avatars2.githubusercontent.com/u/12504344?v=3&s=100 "Expo.io")](https://expo.io)
[Expo.io](https://expo.io)


[![swm](https://avatars1.githubusercontent.com/u/6952717?v=3&s=100 "Software Mansion")](https://swmansion.com)
[Software Mansion](https://swmansion.com)


[![wix](https://avatars3.githubusercontent.com/u/686511?s=200&v=4&s=100 "Wix")](https://www.wix.engineering)
[Wix](https://www.wix.engineering)
