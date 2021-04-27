[![NPM version](https://badge.fury.io/js/tslint.svg)](https://badge.fury.io/js/tslint)
[![Downloads](https://img.shields.io/npm/dm/tslint.svg)](https://npmjs.org/package/tslint)
[![Dependency Status](https://david-dm.org/palantir/tslint.svg)](https://david-dm.org/palantir/tslint)
[![devDependency Status](https://david-dm.org/palantir/tslint/dev-status.svg)](https://david-dm.org/palantir/tslint/?type=dev)
[![peerDependency Status](https://david-dm.org/palantir/tslint/peer-status.svg)](https://david-dm.org/palantir/tslint/?type=peer)
[![Circle CI](https://circleci.com/gh/palantir/tslint.svg?style=svg)](https://circleci.com/gh/palantir/tslint)

# TSLint

:warning: __TSLint is deprecated.__

> See this issue for more details: [Roadmap: TSLint &rarr; ESLint](https://github.com/palantir/tslint/issues/4534). If you're interested in helping with the TSLint/ESLint migration, please check out our [OSS Fellowship](https://medium.com/palantir/fellowships-for-open-source-developers-3892e6b75ee1) program.

TSLint is an extensible static analysis tool that checks [TypeScript](https://github.com/Microsoft/TypeScript) code for readability, maintainability, and functionality errors. It is widely supported across modern editors & build systems and can be customized with your own lint rules, configurations, and formatters.

TSLint currently supports:

-   an extensive set of core rules
-   custom lint rules
-   custom formatters (failure reporters)
-   inline disabling and enabling of rules with comment flags in source code
-   configuration presets (`tslint:latest`, `tslint-react`, etc.) and plugin composition
-   automatic fixing of formatting & style violations
-   integration with [MSBuild](https://github.com/joshuakgoldberg/tslint.msbuild), [Grunt](https://github.com/palantir/grunt-tslint), [Gulp](https://github.com/panuhorsmalahti/gulp-tslint), [Atom](https://github.com/AtomLinter/linter-tslint), [Eclipse](https://github.com/palantir/eclipse-tslint), [Emacs](https://www.flycheck.org/), [Sublime](https://packagecontrol.io/packages/SublimeLinter-contrib-tslint), [Vim](https://github.com/scrooloose/syntastic), [Visual Studio 2015](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebAnalyzer), [Visual Studio 2017](https://marketplace.visualstudio.com/items?itemName=RichNewman.TypeScriptAnalyzer), [Visual Studio code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) (alternative: use [this extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) for TS <3.2), [WebStorm](https://www.jetbrains.com/webstorm/help/tslint.html) and [more](https://palantir.github.io/tslint/usage/third-party-tools/)

## Installation & Usage

Please refer to the full installation & usage documentation on the [TSLint website](https://palantir.github.io/tslint/). There, you'll find information about

-   [configuration](https://palantir.github.io/tslint/usage/configuration/),
-   [core rules](https://palantir.github.io/tslint/rules/),
-   [core formatters](https://palantir.github.io/tslint/formatters/), and
-   [customization of TSLint](https://palantir.github.io/tslint/develop/custom-rules/).
-   [inline disabling and enabling of rules with comment flags](https://palantir.github.io/tslint/usage/rule-flags/)

## TSLint Playground

There is a sandbox environment for TSLint at [palantir.github.io/tslint-playground](https://palantir.github.io/tslint-playground/), which can be used to test rules and see how TSLint works. Issues can be filed against `tslint-playground` [here](https://github.com/palantir/tslint-playground).

## Custom Rules & Plugins

#### Custom rule sets from Palantir

-   [tslint-react](https://github.com/palantir/tslint-react) - Lint rules related to React & JSX.
-   [tslint-blueprint](https://github.com/palantir/tslint-blueprint) - Lint rules to enforce best practices with [blueprintjs libraries](https://github.com/palantir/blueprint)

#### Custom rule sets from the community

If we don't have all the rules you're looking for, you can either write your own [custom rules](https://palantir.github.io/tslint/develop/custom-rules/) or use rules implementations developed by the community. The repos below are a good source of custom rules:

-   [ESLint rules for TSLint](https://github.com/buzinas/tslint-eslint-rules) - Improve your TSLint with the missing ESLint Rules
-   [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib) - A set of TSLint rules used on some Microsoft projects
-   [codelyzer](https://github.com/mgechev/codelyzer) - A set of tslint rules for static code analysis of Angular TypeScript projects
-   [vrsource-tslint-rules](https://github.com/vrsource/vrsource-tslint-rules)
-   [tslint-immutable](https://github.com/jonaskello/tslint-immutable) - TSLint rules to disable mutation in TypeScript
-   [tslint-consistent-codestyle](https://github.com/ajafff/tslint-consistent-codestyle) - TSLint rules to enforce consistent code style in TypeScript
-   [tslint-sonarts](https://github.com/SonarSource/SonarTS) - Bug-finding rules based on advanced code models to spot hard to find errors in TypeScript
-   [tslint-clean-code](https://github.com/Glavin001/tslint-clean-code) - A set of TSLint rules inspired by the Clean Code handbook
-   [rxjs-tslint-rules](https://github.com/cartant/rxjs-tslint-rules) - TSLint rules for RxJS

## Development

Prerequisites:

-   `node` v7+
-   `yarn` v1.0+

#### Quick Start

```bash
git clone git@github.com:palantir/tslint.git --config core.autocrlf=input --config core.eol=lf
yarn
yarn compile
yarn test
```
