[![Build Status](https://travis-ci.org/jest-community/jest-watch-select-projects.svg?branch=master)](https://travis-ci.org/jest-community/jest-watch-select-projects) [![npm version](https://badge.fury.io/js/jest-watch-select-projects.svg)](https://badge.fury.io/js/jest-watch-select-projects)

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://cdn.worldvectorlogo.com/logos/jest.svg">
  </a>
  <h1>jest-watch-select-projects</h1>
  <p>Select which Jest project to run</p>
</div>

![select-project](https://user-images.githubusercontent.com/574806/40741798-3ca7c250-6401-11e8-8398-d39ab4eea011.gif)

## Usage

### Install

Install `jest`_(it needs Jest 23+)_ and `jest-watch-select-projects`

```bash
yarn add --dev jest jest-watch-select-projects

# or with NPM

npm install --save-dev jest jest-watch-select-projects
```

### Add it to your Jest config

In your `package.json`

```json
{
  "jest": {
    "watchPlugins": ["jest-watch-select-projects"]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  watchPlugins: ['jest-watch-select-projects'],
};
```

### Configuring your key and prompt name

```js
module.exports = {
  watchPlugins: [
    [
      'jest-watch-select-projects',
      {
        key: 'X',
        // function or string
        prompt() {
          const activeProjectsText = this._getActiveProjectsText();
          return 'do something with my custom prompt';
        },
      },
    ],
  ],
};
```

### Run Jest in watch mode

```bash
yarn jest --watch
```

## FAQ

**Why is this running all of my projects?**

Make certain that you're using the SPACE key to toggle the selected state of projects and the ENTER key to confirm your settings.
