/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const nullthrows = require("nullthrows");

const path = require("path");

module.exports = class Package {
  constructor(packagePath, data) {
    this.data = data;
    this.path = packagePath;
    this.root = path.dirname(packagePath);
    this.type = "Package";
  }

  getMain() {
    // Copied from node-haste/Package.js
    const replacements = getReplacements(this.data);

    if (typeof replacements === "string") {
      return path.join(this.root, replacements);
    }

    let main = getMain(this.data);

    if (replacements && typeof replacements === "object") {
      main =
        replacements[main] ||
        replacements[main + ".js"] ||
        replacements[main + ".json"] ||
        replacements[main.replace(/(\.js|\.json)$/, "")] ||
        main;
    }

    return path.join(this.root, main);
  }

  getName() {
    return nullthrows(this.data.name);
  }

  isHaste() {
    return !!this.data.name;
  }

  redirectRequire(name) {
    // Copied from node-haste/Package.js
    const replacements = getReplacements(this.data);

    if (!replacements || typeof replacements !== "object") {
      return name;
    }

    if (!path.isAbsolute(name)) {
      const replacement = replacements[name]; // support exclude with "someDependency": false

      return replacement === false ? false : replacement || name;
    }

    let relPath = "./" + path.relative(this.root, name);

    if (path.sep !== "/") {
      relPath = relPath.replace(new RegExp("\\" + path.sep, "g"), "/");
    }

    let redirect = replacements[relPath]; // false is a valid value

    if (redirect == null) {
      redirect = replacements[relPath + ".js"];

      if (redirect == null) {
        redirect = replacements[relPath + ".json"];
      }
    } // support exclude with "./someFile": false

    if (redirect === false) {
      return false;
    }

    if (redirect) {
      return path.join(this.root, redirect);
    }

    return name;
  }
};

function getMain(pkg) {
  return pkg.main || "index";
} // Copied from node-haste/Package.js

function getReplacements(pkg) {
  let rn = pkg["react-native"];
  let browser = pkg.browser;

  if (rn == null) {
    return browser;
  }

  if (browser == null) {
    return rn;
  }

  const main = getMain(pkg);

  if (typeof rn !== "object") {
    rn = {
      [main]: rn
    };
  }

  if (typeof browser !== "object") {
    browser = {
      [main]: browser
    };
  } // merge with "browser" as default,
  // "react-native" as override

  return _objectSpread({}, browser, rn);
}
