"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLatestRelease;

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
    return data;
  };

  return data;
}

var _releaseCacheManager = _interopRequireDefault(require("./releaseCacheManager"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks via GitHub API if there is a newer stable React Native release and,
 * if it exists, returns the release data.
 *
 * If the latest release is not newer or if it's a prerelease, the function
 * will return undefined.
 */
async function getLatestRelease(name, currentVersion) {
  _cliTools().logger.debug('Checking for a newer version of React Native');

  try {
    _cliTools().logger.debug(`Current version: ${currentVersion}`);

    const cachedLatest = _releaseCacheManager.default.get(name, 'latestVersion');

    if (cachedLatest) {
      _cliTools().logger.debug(`Cached release version: ${cachedLatest}`);
    }

    const aWeek = 7 * 24 * 60 * 60 * 1000;

    const lastChecked = _releaseCacheManager.default.get(name, 'lastChecked');

    const now = new Date();

    if (lastChecked && Number(now) - Number(new Date(lastChecked)) < aWeek) {
      _cliTools().logger.debug('Cached release is still recent, skipping remote check');

      return;
    }

    _cliTools().logger.debug('Checking for newer releases on GitHub');

    const eTag = _releaseCacheManager.default.get(name, 'eTag');

    const latestVersion = await getLatestRnDiffPurgeVersion(name, eTag);

    _cliTools().logger.debug(`Latest release: ${latestVersion}`);

    if (_semver().default.compare(latestVersion, currentVersion) === 1 && !_semver().default.prerelease(latestVersion)) {
      return {
        version: latestVersion,
        changelogUrl: buildChangelogUrl(latestVersion),
        diffUrl: buildDiffUrl(currentVersion)
      };
    }
  } catch (e) {
    _cliTools().logger.debug('Something went wrong with remote version checking, moving on');

    _cliTools().logger.debug(e);
  }
}

function buildChangelogUrl(version) {
  return `https://github.com/facebook/react-native/releases/tag/v${version}`;
}

function buildDiffUrl(version) {
  return `https://react-native-community.github.io/upgrade-helper/?from=${version}`;
}
/**
 * Returns the most recent React Native version available to upgrade to.
 */


async function getLatestRnDiffPurgeVersion(name, eTag) {
  const options = {
    // https://developer.github.com/v3/#user-agent-required
    headers: {
      'User-Agent': 'React-Native-CLI'
    }
  };

  if (eTag) {
    options.headers['If-None-Match'] = eTag;
  }

  const {
    data,
    status,
    headers
  } = await (0, _cliTools().fetch)('https://api.github.com/repos/react-native-community/rn-diff-purge/tags', options); // Remote is newer.

  if (status === 200) {
    const body = data;
    const latestVersion = body[0].name.substring(8);
    const eTagHeader = headers.get('eTag'); // Update cache only if newer release is stable.

    if (!_semver().default.prerelease(latestVersion) && eTagHeader) {
      _cliTools().logger.debug(`Saving ${eTagHeader} to cache`);

      _releaseCacheManager.default.set(name, 'eTag', eTagHeader);

      _releaseCacheManager.default.set(name, 'latestVersion', latestVersion);
    }

    return latestVersion;
  } // Cache is still valid.


  if (status === 304) {
    const latestVersion = _releaseCacheManager.default.get(name, 'latestVersion');

    if (latestVersion) {
      return latestVersion;
    }
  } // Should be returned only if something went wrong.


  return '0.0.0';
}