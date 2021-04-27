/* global google */
import _ from "lodash"

export function getOffsetOverride(containerElement, props) {
  const { getPixelPositionOffset } = props
  //
  // Allows the component to control the visual position of the OverlayView
  // relative to the LatLng pixel position.
  //
  if (_.isFunction(getPixelPositionOffset)) {
    return getPixelPositionOffset(
      containerElement.offsetWidth,
      containerElement.offsetHeight
    )
  } else {
    return {}
  }
}

function createLatLng(inst, Type) {
  return new Type(inst.lat, inst.lng)
}

function createLatLngBounds(inst, Type) {
  return new Type(
    new google.maps.LatLng(inst.ne.lat, inst.ne.lng),
    new google.maps.LatLng(inst.sw.lat, inst.sw.lng)
  )
}

function ensureOfType(inst, type, factory) {
  if (inst instanceof type) {
    return inst
  } else {
    return factory(inst, type)
  }
}

function getLayoutStylesByBounds(mapCanvasProjection, offset, bounds) {
  const ne = mapCanvasProjection.fromLatLngToDivPixel(bounds.getNorthEast())
  const sw = mapCanvasProjection.fromLatLngToDivPixel(bounds.getSouthWest())
  if (ne && sw) {
    return {
      left: `${sw.x + offset.x}px`,
      top: `${ne.y + offset.y}px`,
      width: `${ne.x - sw.x - offset.x}px`,
      height: `${sw.y - ne.y - offset.y}px`,
    }
  }
  return {
    left: `-9999px`,
    top: `-9999px`,
  }
}

function getLayoutStylesByPosition(mapCanvasProjection, offset, position) {
  const point = mapCanvasProjection.fromLatLngToDivPixel(position)
  if (point) {
    const { x, y } = point
    return {
      left: `${x + offset.x}px`,
      top: `${y + offset.y}px`,
    }
  }
  return {
    left: `-9999px`,
    top: `-9999px`,
  }
}

export function getLayoutStyles(mapCanvasProjection, offset, props) {
  if (props.bounds) {
    const bounds = ensureOfType(
      props.bounds,
      google.maps.LatLngBounds,
      createLatLngBounds
    )
    return getLayoutStylesByBounds(mapCanvasProjection, offset, bounds)
  } else {
    const position = ensureOfType(
      props.position,
      google.maps.LatLng,
      createLatLng
    )
    return getLayoutStylesByPosition(mapCanvasProjection, offset, position)
  }
}
