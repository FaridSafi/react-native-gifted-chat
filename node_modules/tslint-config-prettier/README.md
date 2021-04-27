# tslint-config-prettier

[![npm](https://img.shields.io/npm/v/tslint-config-prettier.svg)](https://www.npmjs.com/package/tslint-config-prettier)
[![Travis](https://img.shields.io/travis/alexjoverm/tslint-config-prettier.svg)](https://travis-ci.org/prettier/tslint-config-prettier)
[![downloads](https://img.shields.io/npm/dm/tslint-config-prettier.svg)](https://www.npmjs.com/package/tslint-config-prettier)
[![dependencies Status](https://img.shields.io/david/prettier/tslint-config-prettier.svg)](https://david-dm.org/prettier/tslint-config-prettier)
[![devDependencies Status](https://img.shields.io/david/dev/prettier/tslint-config-prettier.svg)](https://david-dm.org/prettier/tslint-config-prettier?type=dev)

<h3> :cop: TSLint  +  :nail_care: Prettier = :heart_eyes: </h3>

Do you want to use [TSLint](https://palantir.github.io/tslint/) and [Prettier](https://github.com/prettier/prettier) without conflicts? `tslint-config-prettier` disables all [conflicting rules](https://unpkg.com/tslint-config-prettier) that may cause such problems. Prettier takes care of the formatting whereas tslint takes care of all the other things.

> Check how it works in **[this tutorial](https://alexjoverm.github.io/2017/06/12/Use-Prettier-with-TSLint-and-be-happy/)**.

### Get started

```bash
yarn add --dev tslint-config-prettier
# or
npm install --save-dev tslint-config-prettier
```

Make sure you've already set up [TSLint](https://palantir.github.io/tslint/) and [Prettier](https://github.com/prettier/prettier).

Then, extend your `tslint.json`, and make sure `tslint-config-prettier` is **at the end**:

```json
{
  "extends": [
    "tslint:latest",
    "tslint-config-prettier"
  ]
}
```

### More configuration

`tslint-config-prettier` also turns off formatting rules from the following rulesets, so you can use them safely.

- [codelyzer](https://github.com/mgechev/codelyzer)
- [tslint](https://github.com/palantir/tslint)
- [tslint-consistent-codestyle](https://github.com/ajafff/tslint-consistent-codestyle)
- [tslint-divid](https://github.com/jonaskello/tslint-divid)
- [tslint-eslint-rules](https://github.com/buzinas/tslint-eslint-rules)
- [tslint-immutable](https://github.com/jonaskello/tslint-immutable)
- [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib)
- [tslint-misc-rules](https://github.com/jwbay/tslint-misc-rules)
- [tslint-react](https://github.com/palantir/tslint-react)
- [vrsource-tslint-rules](https://github.com/vrsource/vrsource-tslint-rules)

```json
{
  "extends": [
    "tslint:latest",
    "tslint-react",
    "tslint-eslint-rules",
    "tslint-config-prettier"
  ]
}
```

### CLI helper tool

`tslint-config-prettier` is shipped with a little CLI tool to help you check if your configuration contains any rules that are in conflict with Prettier. (require `tslint` installed)

In order to execute the CLI tool, first add a script for it to `package.json`:

```json
{
  "scripts": {
    "tslint-check": "tslint-config-prettier-check ./tslint.json"
  }
}
```

Then run `yarn tslint-check` or `npm run tslint-check`.

### Tutorials

- [Using TSlint with Prettier](https://alexjoverm.github.io/2017/06/12/Use-Prettier-with-TSLint-and-be-happy/)
- [Use Prettier with TSLint without conflicts (video)](https://egghead.io/lessons/typescript-use-prettier-with-tslint-without-conflicts-c39670eb/)

### Contributing

Please read [CONTRIBUTING.md](https://github.com/prettier/tslint-config-prettier/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Related

- [tslint-plugin-prettier](https://github.com/ikatyang/tslint-plugin-prettier) - Runs Prettier as a TSLint rule and reports differences as individual TSLint issues.

### Credits

Made with :heart: by [@alexjoverm](https://twitter.com/alexjoverm) and all its [contributors](https://github.com/prettier/tslint-config-prettier/graphs/contributors)
