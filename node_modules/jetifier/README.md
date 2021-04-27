[![npm version](https://badge.fury.io/js/jetifier.svg)](http://badge.fury.io/js/jetifier)
[![npm total downloads](https://img.shields.io/npm/dt/jetifier.svg)](https://img.shields.io/npm/dt/jetifier.svg)
[![npm monthly downloads](https://img.shields.io/npm/dm/jetifier.svg)](https://img.shields.io/npm/dm/jetifier.svg)
[![npm weekly downloads](https://img.shields.io/npm/dw/jetifier.svg)](https://img.shields.io/npm/dw/jetifier.svg)

The jetifier AndroidX transition tool in npm format, with a react-native compatible style

## TOC

- [Why?](#do_you_need_this)
- [Convert to AndroidX](#to-jetify--convert-node_modules-dependencies-to-androidx)
- [Convert to Support Libraries](#to-reverse-jetify--convert-node_modules-dependencies-to-support-libraries)
- [Convert JAR/AAR/ZIP files](#usage-for-jarzipaar-files)
- [Troubleshooting](#troubleshooting)
- [Module Maintainers](#module-maintainers)
- [Contributing](#contributing)

## Do you need this?

***Note that jetifier is included and ran automatically with [react-native-community/cli](https://github.com/react-native-community/cli) for React Native versions 0.60 and above, so you do not need to install and run jetifier manually.***

If you use React Native modules with native Java code that isn't converted to AndroidX, and your app is AndroidX, you probably need this.

Why?

The [standard AndroidX migration](https://developer.android.com/jetpack/androidx/migrate) rewrites your **current** installed source code, and at build time dynamically re-writes any linked jar/aar/zip files. This is all a "normal" Android app needs.

React Native apps are not standard Android apps. React Native modules with native Java code usually distribute that code as source, and link the source code directly.

When you update your modules (or install them again after following the standard AndroidX migration), the freshly installed Java code from your react-native dependencies will not be translated to AndroidX anymore, and your build will fail.

So you have to perform an AndroidX migration on your linked source every time you update react native modules that ship native Java code. That is what this tool does - it can rewrite the source in node_modules every time you call it.

## Usage for source files

### To jetify / convert node_modules dependencies to AndroidX

Imagine you have a react-native project. [One of your library dependencies converts to AndroidX.](https://developers.google.com/android/guides/releases#june_17_2019), and you need to use the new version.

So now you need to convert your app to AndroidX, but many of your react-native libraries ship native Java code and have not updated. How is this done?

1. First, use Android Studio's refactoring tool to convert your app re: the [Android developer docs](https://developer.android.com/jetpack/androidx/migrate)
1. `npm install --save-dev jetifier`
1. `npx jetify`
1. `npx react-native run-android` (your app should correctly compile and work)
1. Call `npx jetify` run in the postinstall target of your package.json (Any time your dependencies update you have to jetify again)

***As noted above, jetify is ran for you automatically in React Native versions 0.60 and above.***

Proof it works / how this is tested: <https://github.com/mikehardy/rn-androidx-demo>. You can clone that repo, run the script, and see it works. Please feel to make PRs to that repo, especially in App.js or in the dependencies included, if you would like to demonstrate success or failure for a specific module.

_Inspiration:_ this jetify command was based on [an idea](https://gist.github.com/janicduplessis/df9b5e3c2b2e23bbae713255bdb99f3c) from @janicduplessis - thank you Janic!

### To reverse-jetify / convert node_modules dependencies to Support Libraries

Maybe you are in the position where you must not migrate to AndroidX yet. But your libraries have started to migrate and they ship AndroidX native Java code.

You can convert them back with reverse-jetify mode

Follow the instructions from above to convert to AndroidX, **but add the `-r` flag to the `npx jetify` call.**

If a library ships only as a jar/aar/zip file, you will have to use jetifier-standalone to convert that as well, but you can delay the AndroidX migration indefinitely with this style.

## Usage for jar/zip/aar files

You may be a library maintainer, wanting to ship an AAR of your support code converted to AndroidX, or maybe you ship an AAR normally and you want to continue to support your non-AndroidX users even after you convert your library to AndroidX?

As part of your build process you can use this tool like so:

1. `npm install jetifier` (or maybe `npm install -g jetifier` to make it globally available)
1. `npx jetifier-standalone <your arguments here>` (use `npx jetifier-standalone -h` for help)

I have not altered the jetifier-standalone distribution in any way.

Other than the npm-specific instructions, consult [the official jetifier documentation](https://developer.android.com/studio/command-line/jetifier)

**Note that this is implemented for you if you [integrate the bob build tool](https://github.com/react-native-community/bob/blob/master/README.md#L44)**

## Troubleshooting

Unfortunately jetifier can't solve all your problems. Here are some reasons it could fail:

1. You have a dependency that packages things in violation of Android packaging rules, like including an extra AndroidManifest.xml or similar: <https://github.com/acaziasoftcom/react-native-bottomsheet/pull/23> - this will lead to dex merger issues about duplicate entries. Open pull requests with the libraries that do this.
1. You have a dependency that does not allow overrides of compileSdk, so you can't set the compileSdk to 28 as AndroidX requires: <https://github.com/razorpay/react-native-razorpay/pull/201>. This can lead to errors in resource merger where styles reference unknown attributes. Open pull requests with the libraries that do this
1. You are missing the 'node-pre-gyp' package - you may see this error `ENOENT: no such file or directory, stat 'node_modules/fsevents/node_modules/.bin/node-pre-gyp'` - if so try something like `npm -i --save-dev node-pre-gyp`, see #22
1. A java file has import statements with wildcards that did not convert (`*`) - like `import android.support.v4.content.*`. This is a problem with the library, they should not use wildcards, they should use concrete imports. Open upstream issues with the library and use the excellent `patch-package` in the meantime to fix them until the library is updated. Example in [react-native-navigation](https://github.com/wix/react-native-navigation/pull/5218/files)

So far there has not been a case of `npx jetify` failing that wasn't based in an error in a library, so if you have a problem please examine the error and the dependency very closely and help the libraries with fixes.

## Module Maintainers

One of the goals of this library is to enable module maintainers to support their AndroidX app users and their pre-AndroidX users at the same time, from the same codebase, so the react-native 0.59 -> 0.60 transition is smoother.

Maintainers will potentially have to make a few changes for that to work well though.

Here are the areas libraries may need to change to work well for AndroidX and pre-AndroidX apps at the same time:

1. Dependency version overrides. In your library, all of your dependencies and your SDK versions should have version overrides. These offer your users flexibility to pin the versions to pre-AndroidX or AndroidX versions. Example: <https://github.com/razorpay/react-native-razorpay/pull/201> and showing ability to be very specific: <https://github.com/react-native-community/react-native-camera/blob/master/android/build.gradle#L78>
1. AppCompat library _name_ overrides - this may seem odd, but if you depend on the appcompat (or similar) library itself, the whole name may need to be overridden to work correctly on RN0.60. Here is an example: <https://github.com/react-native-community/react-native-device-info/commit/d448d872906335813d53a7e8f8dc7860ae160c40>
1. There may be unexpected problems like one of your dependencies is doing something wrong, but it's not really your fault - bottomsheet had that problem <https://github.com/acaziasoftcom/react-native-bottomsheet/pull/23> - keep an open mind about the fixes and there is probably something you can do without giving up on forwards and backwards compatibility during the transition
1. Do not use wildcard imports of support library classes, but you don't need to convert to AndroidX to fix them. Just make a patch release with the concrete imports like react-native-navigation - <https://github.com/wix/react-native-navigation/pull/5218/files>
1. Finally, not really related to AndroidX, but you may simply have to make some changes related to the new auto-linking. <https://github.com/react-native-community/cli/blob/master/docs/dependencies.md>

## Contributing

Please feel free to pull requests or log issues, especially to update versions if I somehow fail to notice an update.

I have tried to make it easy for contributors to propose changes, by providing a test suite so you can safely make a change and see if it works.

I have [continuous integration enabled](https://travis-ci.com/mikehardy/jetifier) so we can prove changes work and you can make changes safely, it should pass those tests before you submit for review.

You may need to fork the test suite [rn-androidx-demo](https://github.com/mikehardy/rn-androidx-demo) if you need to add a new react-native module to test, or if you are doing something other than modifying 'jetify' (for instance if you install a python or javascript version - you'll need to [copy the git version of your new script-under-test in rn-androidx-demo/make-demo.sh](https://github.com/mikehardy/rn-androidx-demo/blob/master/make-demo.sh#L76) so it is testing your changes). Then you would [alter the .travis.yml temporarily to point to your fork of rn-androidx-demo](https://github.com/mikehardy/jetifier/blob/master/.travis.yml#L38) so that your jetifier changes were working against the updated test suite. That's all pretty annoying and I will probably move the test suite so it is internal to jetifier in the future (PRs to do that welcome...)

Thanks!
