import path from "path"
import { execSync } from "child_process"
import _ from "lodash"

function maybeTypeToPropType(maybeType) {
  switch (maybeType) {
    case "boolean":
      return "bool"
    case "number":
      return maybeType
    case "string":
      return maybeType
    default:
      return "any"
  }
}

export default function transformer(file, api) {
  const j = api.jscodeshift
  const wrap = j(file.source)

  const exportConfig = wrap.find(j.ExportNamedDeclaration).at(0)
  const configString = exportConfig.find(j.TemplateElement).get().node.value.raw
  const {
    prohibitedPropNames = [],
    KlassNameOverrride,
    eventMapOverrides,
    getInstanceFromComponent,
  } = JSON.parse(configString)
  exportConfig.remove()
  const eventNamesOverrides = _.values(eventMapOverrides)

  const KlassName =
    KlassNameOverrride ||
    wrap
      .find(j.ClassDeclaration)
      .at(0)
      .get().node.id.name

  const result = execSync(
    `./node_modules/.bin/babel-node ${path.resolve(
      __dirname,
      `./ClassDefinition.js`
    )} "${KlassName}"`,
    {
      encoding: "utf-8",
    }
  )
  const { constructor, methods, events } = JSON.parse(result)
  const methodAsProps = methods.filter(({ name }) => {
    const matchResult = name.match(/^set(\S+)/)
    return (
      name !== "setMap" &&
      matchResult &&
      !_.includes(prohibitedPropNames, _.lowerFirst(matchResult[1]))
    )
  })

  const publicMethods = methods.filter(({ name }) => {
    const matchResult = name.match(/^get(\S+)/)
    return (
      !name.match(/Map$/) &&
      matchResult &&
      !_.includes(prohibitedPropNames, _.lowerFirst(matchResult[1]))
    )
  })

  wrap.find(j.Program).forEach(path => {
    j(path).replaceWith({
      ...path.node.__clone(),
      body: [
        {
          ...path.node.body[0],
          comments: [
            j.commentBlock(AUTO_GENERATED_HEADER, true),
            ...(path.node.body[0].comments || []),
          ],
        },
        ...path.node.body.slice(1),
      ],
    })
  })

  wrap.find(j.ClassBody).forEach(path => {
    j(path).replaceWith(
      Object.assign(path.node.__clone(), {
        body: [...path.node.body, ...txClassMethods()],
      })
    )
  })

  wrap.find(j.ObjectExpression).forEach(path => {
    if (_.get(path, "parentPath.node.key.name") === "propTypes") {
      j(path).replaceWith(
        Object.assign(path.node.__clone(), {
          properties: [
            ...path.node.properties.filter(
              ({ key: { name } }) => name !== "__jscodeshiftPlaceholder__"
            ),
            ...txPropTypes(),
          ],
        })
      )
    } else if (_.get(path, "parentPath.node.id.name") === "eventMap") {
      j(path).replaceWith(
        Object.assign(path.node.__clone(), {
          properties: [...path.node.properties, ...eventMap()],
        })
      )
    } else if (_.get(path, "parentPath.node.id.name") === "updaterMap") {
      j(path).replaceWith(
        Object.assign(path.node.__clone(), {
          properties: [...path.node.properties, ...updaterMap()],
        })
      )
    }
  })

  return wrap.toSource()

  function txPropTypes() {
    return [
      ...methodAsProps.map(({ name, args, desc }) => {
        const [, prop] = name.match(/^set(\S+)/)
        const [, maybeType] = args.match(/\S+:(\S+)/)

        return Object.assign(
          j.objectProperty(
            j.identifier(`default${prop}`),
            j.identifier(`PropTypes.${maybeTypeToPropType(maybeType)}`)
          ),
          {
            comments: [j.commentBlock(`*\n * @type ${maybeType}\n `, true)],
          }
        )
      }),
      ...methodAsProps.map(({ name, args, desc }) => {
        const [, prop] = name.match(/^set(\S+)/)
        const [, maybeType] = args.match(/\S+:(\S+)/)

        return Object.assign(
          j.objectProperty(
            j.identifier(_.lowerFirst(prop)),
            j.identifier(`PropTypes.${maybeTypeToPropType(maybeType)}`)
          ),
          {
            comments: [j.commentBlock(`*\n * @type ${maybeType}\n `, true)],
          }
        )
      }),

      ..._.map(eventMapOverrides, (eventName, callbackName) =>
        Object.assign(
          j.objectProperty(
            j.identifier(callbackName),
            j.identifier(`PropTypes.func`)
          ),
          {
            comments: [j.commentBlock(`*\n * function\n `, true)],
          }
        )
      ),
      ...events
        .filter(({ name }) => !_.includes(eventNamesOverrides, name))
        .map(({ name }) =>
          Object.assign(
            j.objectProperty(
              j.identifier(_.camelCase(`on${_.capitalize(name)}`)),
              j.identifier(`PropTypes.func`)
            ),
            {
              comments: [j.commentBlock(`*\n * function\n `, true)],
            }
          )
        ),
    ]
  }

  function txClassMethods() {
    return [
      ...publicMethods.map(({ name, returns, returnsDesc }) => {
        return Object.assign(
          j.classMethod(
            "method",
            j.identifier(name),
            [],
            j.blockStatement([
              j.returnStatement(
                j.callExpression(
                  j.identifier(`${getInstanceFromComponent}.${name}`),
                  []
                )
              ),
            ])
          ),
          {
            comments: [
              j.commentBlock(
                `*\n * ${returnsDesc}\n * @type ${returns}\n * @public \n `,
                true
              ),
            ],
          }
        )
      }),
    ]
  }

  function eventMap() {
    return [
      ..._.map(eventMapOverrides, (eventName, callbackName) =>
        j.objectProperty(j.identifier(callbackName), j.stringLiteral(eventName))
      ),
      ...events
        .filter(({ name }) => !_.includes(eventNamesOverrides, name))
        .map(({ name }) =>
          j.objectProperty(
            j.identifier(_.camelCase(`on${_.capitalize(name)}`)),
            j.stringLiteral(name)
          )
        ),
    ]
  }

  function updaterMap() {
    return [
      ...methodAsProps.map(({ name, args, desc }) => {
        const [, prop] = name.match(/^set(\S+)/)

        return j.objectMethod(
          "method",
          j.identifier(_.lowerFirst(prop)),
          [j.identifier("instance"), j.identifier(_.lowerFirst(prop))],
          j.blockStatement([
            j.expressionStatement(
              j.callExpression(j.identifier(`instance.${name}`), [
                j.identifier(_.lowerFirst(prop)),
              ])
            ),
          ])
        )
      }),
    ]
  }
}

const AUTO_GENERATED_HEADER = `
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at \`src/macros/\`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 `
