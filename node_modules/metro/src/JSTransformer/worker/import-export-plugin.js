/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */
"use strict";
/* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.99 was deployed. To see the error, delete this comment
 * and run Flow. */

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
}

const template = require("@babel/template").default;

/**
 * Produces a Babel template that transforms an "import * as x from ..." or an
 * "import x from ..." call into a "const x = importAll(...)" call with the
 * corresponding id in it.
 */
const importTemplate = template(`
  var LOCAL = IMPORT(FILE);
`);
/**
 * Produces a Babel template that transforms an "import {x as y} from ..." into
 * "const y = require(...).x" call with the corresponding id in it.
 */

const importNamedTemplate = template(`
  var LOCAL = require(FILE).REMOTE;
`);
/**
 * Produces a Babel template that transforms an "import ..." into
 * "require(...)", which is considered a side-effect call.
 */

const importSideEffectTemplate = template(`
  require(FILE);
`);
/**
 * Produces an "export all" template that traverses all exported symbols and
 * re-exposes them.
 */

const exportAllTemplate = template(`
  var REQUIRED = require(FILE);

  for (var KEY in REQUIRED) {
    exports[KEY] = REQUIRED[KEY];
  }
`);
/**
 * Produces a "named export" or "default export" template to export a single
 * symbol.
 */

const exportTemplate = template(`
  exports.REMOTE = LOCAL;
`);
/**
 * Flags the exported module as a transpiled ES module. Needs to be kept in 1:1
 * compatibility with Babel.
 */

const esModuleExportTemplate = template(`
  Object.defineProperty(exports, '__esModule', {value: true});
`);
/**
 * Resolution template in case it is requested.
 */

const resolveTemplate = template.expression(`
  require.resolve(NODE)
`);
/**
 * Enforces the resolution of a path to a fully-qualified one, if set.
 */

function resolvePath(node, resolve) {
  if (!resolve) {
    return node;
  }

  return resolveTemplate({
    NODE: node
  });
} // eslint-disable-next-line lint/flow-no-fixme

function importExportPlugin(_ref) {
  let t = _ref.types;
  return {
    visitor: {
      ExportAllDeclaration(path, state) {
        if (path.node.exportKind && path.node.exportKind !== "value") {
          return;
        }

        state.exportAll.push({
          file: path.get("source").node.value
        });
        path.remove();
      },

      ExportDefaultDeclaration(path, state) {
        if (path.node.exportKind && path.node.exportKind !== "value") {
          return;
        }

        const declaration = path.get("declaration");
        const node = declaration.node;
        const id = node.id || path.scope.generateUidIdentifier("default");
        node.id = id;
        state.exportDefault.push({
          local: id.name
        });

        if (t.isDeclaration(declaration)) {
          path.insertBefore(node);
        } else {
          path.insertBefore(
            t.variableDeclaration("var", [t.variableDeclarator(id, node)])
          );
        }

        path.remove();
      },

      ExportNamedDeclaration(path, state) {
        if (path.node.exportKind && path.node.exportKind !== "value") {
          return;
        }

        const declaration = path.get("declaration");
        const specifiers = path.get("specifiers");

        if (declaration.node) {
          if (t.isVariableDeclaration(declaration)) {
            declaration.get("declarations").forEach(d => {
              switch (d.get("id").node.type) {
                case "ObjectPattern":
                  {
                    const properties = d.get("id").get("properties");
                    properties.forEach(p => {
                      const name = p.get("key").node.name;
                      state.exportNamed.push({
                        local: name,
                        remote: name
                      });
                    });
                  }
                  break;

                case "ArrayPattern":
                  {
                    const elements = d.get("id").get("elements");
                    elements.forEach(e => {
                      const name = e.node.name;
                      state.exportNamed.push({
                        local: name,
                        remote: name
                      });
                    });
                  }
                  break;

                default:
                  {
                    const name = d.get("id").node.name;
                    state.exportNamed.push({
                      local: name,
                      remote: name
                    });
                  }
                  break;
              }
            });
          } else {
            const id =
              declaration.node.id || path.scope.generateUidIdentifier();
            const name = id.name;
            declaration.node.id = id;
            state.exportNamed.push({
              local: name,
              remote: name
            });
          }

          path.insertBefore(declaration.node);
        }

        if (specifiers) {
          specifiers.forEach(s => {
            const local = s.node.local;
            const remote = s.node.exported;

            if (path.node.source) {
              const temp = path.scope.generateUidIdentifier(local.name);

              if (local.name === "default") {
                path.insertBefore(
                  importTemplate({
                    IMPORT: state.importDefault,
                    FILE: resolvePath(path.node.source, state.opts.resolve),
                    LOCAL: temp
                  })
                );
                state.exportNamed.push({
                  local: temp.name,
                  remote: remote.name
                });
              } else if (remote.name === "default") {
                path.insertBefore(
                  importNamedTemplate({
                    FILE: resolvePath(path.node.source, state.opts.resolve),
                    LOCAL: temp,
                    REMOTE: local
                  })
                );
                state.exportDefault.push({
                  local: temp.name
                });
              } else {
                path.insertBefore(
                  importNamedTemplate({
                    FILE: resolvePath(path.node.source, state.opts.resolve),
                    LOCAL: temp,
                    REMOTE: local
                  })
                );
                state.exportNamed.push({
                  local: temp.name,
                  remote: remote.name
                });
              }
            } else {
              if (remote.name === "default") {
                state.exportDefault.push({
                  local: local.name
                });
              } else {
                state.exportNamed.push({
                  local: local.name,
                  remote: remote.name
                });
              }
            }
          });
        }

        path.remove();
      },

      ImportDeclaration(path, state) {
        if (path.node.importKind && path.node.importKind !== "value") {
          return;
        }

        const file = path.get("source").node;
        const specifiers = path.get("specifiers");
        const anchor = path.scope.path.get("body.0");

        if (!specifiers.length) {
          anchor.insertBefore(
            importSideEffectTemplate({
              FILE: resolvePath(file, state.opts.resolve)
            })
          );
        } else {
          path.get("specifiers").forEach(s => {
            const imported = s.get("imported").node;
            const local = s.get("local").node;

            switch (s.node.type) {
              case "ImportNamespaceSpecifier":
                anchor.insertBefore(
                  importTemplate({
                    IMPORT: state.importAll,
                    FILE: resolvePath(file, state.opts.resolve),
                    LOCAL: local
                  })
                );
                break;

              case "ImportDefaultSpecifier":
                anchor.insertBefore(
                  importTemplate({
                    IMPORT: state.importDefault,
                    FILE: resolvePath(file, state.opts.resolve),
                    LOCAL: local
                  })
                );
                break;

              case "ImportSpecifier":
                if (imported.name === "default") {
                  anchor.insertBefore(
                    importTemplate({
                      IMPORT: state.importDefault,
                      FILE: resolvePath(file, state.opts.resolve),
                      LOCAL: local
                    })
                  );
                } else {
                  anchor.insertBefore(
                    importNamedTemplate({
                      FILE: resolvePath(file, state.opts.resolve),
                      LOCAL: local,
                      REMOTE: imported
                    })
                  );
                }

                break;

              default:
                throw new TypeError("Unknown import type: " + s.node.type);
            }
          });
        }

        path.remove();
      },

      Program: {
        enter(path, state) {
          state.exportAll = [];
          state.exportDefault = [];
          state.exportNamed = [];
          state.importAll = t.identifier(state.opts.importAll);
          state.importDefault = t.identifier(state.opts.importDefault);
        },

        exit(path, state) {
          const body = path.node.body;
          state.exportDefault.forEach(e => {
            body.push(
              exportTemplate({
                LOCAL: t.identifier(e.local),
                REMOTE: t.identifier("default")
              })
            );
          });
          state.exportAll.forEach(e => {
            body.push.apply(
              body,
              _toConsumableArray(
                exportAllTemplate({
                  FILE: resolvePath(
                    t.stringLiteral(e.file),
                    state.opts.resolve
                  ),
                  REQUIRED: path.scope.generateUidIdentifier(e.file),
                  KEY: path.scope.generateUidIdentifier("key")
                })
              )
            );
          });
          state.exportNamed.forEach(e => {
            body.push(
              exportTemplate({
                LOCAL: t.identifier(e.local),
                REMOTE: t.identifier(e.remote)
              })
            );
          });

          if (
            state.exportDefault.length ||
            state.exportAll.length ||
            state.exportNamed.length
          ) {
            body.unshift(esModuleExportTemplate());

            if (state.opts.out) {
              state.opts.out.isESModule = true;
            }
          } else if (state.opts.out) {
            state.opts.out.isESModule = false;
          }
        }
      }
    }
  };
}

module.exports = importExportPlugin;
