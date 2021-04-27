const chalk = require('chalk');
const prompts = require('prompts');
const ansiEscapes = require('ansi-escapes');
const path = require('path');

class JestPluginProjects {
  constructor({ config }) {
    this._activeProjects = {};
    this._projectNames = [];
    this._usageInfo = {
      key: config.key || 'P',
      prompt:
        config.prompt ||
        function() {
          return `select projects ${chalk.italic(
            this._getActiveProjectsText(),
          )}`;
        },
    };
  }

  apply(jestHook) {
    jestHook.onFileChange(({ projects }) => this._setProjects(projects));
    jestHook.shouldRunTestSuite(({ config }) => {
      const name = this._getDisplayName(config) || this._getBasename(config);
      return (
        this._activeProjects[name] === undefined || this._activeProjects[name]
      );
    });
  }

  onKey() {}

  _getDisplayName(config) {
    const { displayName } = config;
    return typeof displayName === 'object' ? displayName.name : displayName;
  }

  _getBasename(config) {
    const { rootDir } = config;
    return path.basename(rootDir);
  }

  _setProjects(projects) {
    if (!this._projectNames.length) {
      const projectNameSet = projects.reduce((state, p) => {
        const displayName = this._getDisplayName(p.config);
        const basename = this._getBasename(p.config);

        if (state.has(displayName)) {
          throw new Error(`

Found multiple projects with the same \`displayName\`: "${displayName}"

Change the \`displayName\` on at least one of them to prevent name collision.
    - More info: https://facebook.github.io/jest/docs/en/configuration.html#projects-array-string-projectconfig

            `);
        }

        if (state.has(basename)) {
          throw new Error(`

Found multiple projects with the same directory basename: "${basename}"

Add a \`displayName\` to at least one of them to prevent name collision.
    - More info: https://facebook.github.io/jest/docs/en/configuration.html#projects-array-string-projectconfig

            `);
        }

        return new Set([...state, displayName || basename]);
      }, new Set());

      this._projectNames = [...projectNameSet];
      this._setActiveProjects(this._projectNames);
    }
  }

  _setActiveProjects(activeProjects) {
    this._numActiveProjects = activeProjects.length;
    this._activeProjects = this._projectNames.reduce((memo, name) => {
      // eslint-disable-next-line no-param-reassign
      memo[name] = activeProjects.includes(name);
      return memo;
    }, {});
  }

  run() {
    console.log(ansiEscapes.clearScreen);
    return prompts([
      {
        type: 'multiselect',
        name: 'activeProjects',
        message: 'Select projects',
        choices: this._projectNames.map(value => ({
          value,
          selected: this._activeProjects[value],
        })),
      },
    ]).then(({ activeProjects }) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();

      if (activeProjects !== undefined) {
        this._setActiveProjects(activeProjects);
        return true;
      }
      return Promise.reject();
    });
  }

  _getActiveProjectsText() {
    const numProjects = this._projectNames.length;

    if (this._numActiveProjects === numProjects) {
      return '(all selected)';
    }
    if (this._numActiveProjects === 0) {
      return '(zero selected)';
    }

    return `(${this._numActiveProjects}/${numProjects} selected)`;
  }

  getUsageInfo() {
    const { key, prompt } = this._usageInfo;

    const evaluatedPrompt =
      typeof prompt === 'function' ? prompt.call(this) : prompt;

    return {
      key,
      prompt: evaluatedPrompt,
    };
  }
}

module.exports = JestPluginProjects;
