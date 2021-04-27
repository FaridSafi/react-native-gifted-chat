# Changelog

## 1.6.5
- fix: avoid infinite readdir loop w/symlink skip (great work, thanks @gaodeng!)
- docs(README): clarify jetifier runs automatically in RN>=0.60 (thanks @taylorkline!)
- chore(CI): make sure openjdk8 is used on linux CI instances (@mikehardy)

## 1.6.4
- fix: link jetify to jetifier name, `npx jetifier` works (thanks @salakar for the assist)

## 1.6.3
- fix: avoid substring/superstring shadowing in regex (#32) thanks @mysport12!

## 1.6.2

- fix: check file exists before stat / fixes monorepos (#30) thanks @hampustagerud!
- docs(README): clarify usage task list - thanks @Twitchkidd!

## 1.6.1

- docs(README): just docs changes but this gets them out on npmjs.com

## 1.6.0

- feat: parallel jetifier - speedup x cpu count, @m4tt72 making your installs fast :muscle:
- test: exercise macOS in CI alongside linux

## 1.5.1

- add CRLF/LF compatibility, fix potential bug with empty line on mapping @m4tt72 :rocket:

## 1.5.0

- node version courtesy of Yassine Fathi / @m4tt72! Super fast, no bash needed! It's amazing :fire:

## 1.4.2

- No code changes
- docs: add changelog
- docs: add table of contents to readme

## 1.4.1

- No code changes
- tests: CI integrated via Travis + rn-androidx-demo test suite
- docs: "why?" section, performance notes

## 1.4.0

- feat: reverse-jetify mode - use AndroidX react-native libraries in your support library app

## 1.3.2

- fix: repair compatibility with older bash 4.x (the macOS default)

## 1.3.1

- feat(minor): fail fast on errors so you don't burn CI time

## 1.3.0

- perf: massive performance improvement (thanks @cawfree!)

## 1.2.0

- feat: kotlin support (thanks @rozPierog!)

## 1.1.0

- feat: renderscript support (an undocumented but necessary part of AndroidX conversion)
- tests: better integration with rn-androidx-demo test suite

## 1.0.1

- fix: typo in installed link from 'jetlify' to 'jetify'

## 1.0.0

- feat: transform souce code in node_modules on the fly

## v1.0.0-beta04.2

- simple package of binary 'jetifier-standalone' tool for bob the react-native builder
