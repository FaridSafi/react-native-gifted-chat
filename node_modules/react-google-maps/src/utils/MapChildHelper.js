/* global google */
/* eslint-disable no-param-reassign */
import _ from "lodash"

function rdcUncontrolledAndControlledProps(acc, value, key) {
  if (_.has(acc.prevProps, key)) {
    const match = key.match(/^default(\S+)/)
    if (match) {
      const unprefixedKey = _.lowerFirst(match[1])
      if (!_.has(acc.nextProps, unprefixedKey)) {
        acc.nextProps[unprefixedKey] = acc.prevProps[key]
      }
    } else {
      acc.nextProps[key] = acc.prevProps[key]
    }
  }
  return acc
}

function applyUpdaterToNextProps(updaterMap, prevProps, nextProps, instance) {
  _.forEach(updaterMap, (fn, key) => {
    const nextValue = nextProps[key]
    if (nextValue !== prevProps[key]) {
      fn(instance, nextValue)
    }
  })
}

export function construct(propTypes, updaterMap, prevProps, instance) {
  const { nextProps } = _.reduce(propTypes, rdcUncontrolledAndControlledProps, {
    nextProps: {},
    prevProps,
  })
  applyUpdaterToNextProps(
    updaterMap,
    {
      /* empty prevProps for construct */
    },
    nextProps,
    instance
  )
}

export function componentDidMount(component, instance, eventMap) {
  registerEvents(component, instance, eventMap)
}

export function componentDidUpdate(
  component,
  instance,
  eventMap,
  updaterMap,
  prevProps
) {
  component.unregisterAllEvents()
  applyUpdaterToNextProps(updaterMap, prevProps, component.props, instance)
  registerEvents(component, instance, eventMap)
}

export function componentWillUnmount(component) {
  component.unregisterAllEvents()
}

function registerEvents(component, instance, eventMap) {
  const registeredList = _.reduce(
    eventMap,
    (acc, googleEventName, onEventName) => {
      if (_.isFunction(component.props[onEventName])) {
        acc.push(
          google.maps.event.addListener(
            instance,
            googleEventName,
            component.props[onEventName]
          )
        )
      }
      return acc
    },
    []
  )

  component.unregisterAllEvents = _.bind(
    _.forEach,
    null,
    registeredList,
    unregisterEvent
  )
}

function unregisterEvent(registered) {
  google.maps.event.removeListener(registered)
}
