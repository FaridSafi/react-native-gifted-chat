/* global google */
import invariant from "invariant"
import React from "react"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../../utils/MapChildHelper"

import { MAP, DRAWING_MANAGER } from "../../constants"

export const __jscodeshiftPlaceholder__ = `{
  "eventMapOverrides": {
    "onCircleComplete": "circlecomplete",
    "onMarkerComplete": "markercomplete",
    "onOverlayComplete": "overlaycomplete",
    "onPolygonComplete": "polygoncomplete",
    "onPolylineComplete": "polylinecomplete",
    "onRectangleComplete": "rectanglecomplete"
  },
  "getInstanceFromComponent": "this.state[DRAWING_MANAGER]"
}`

/**
 * A wrapper around `google.maps.drawing.DrawingManager`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
 */
export class DrawingManager extends React.PureComponent {
  static propTypes = {
    __jscodeshiftPlaceholder__: null,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
   */
  constructor(props, context) {
    super(props, context)
    invariant(
      google.maps.drawing,
      `Did you include "libraries=drawing" in the URL?`
    )
    const drawingManager = new google.maps.drawing.DrawingManager()
    construct(DrawingManager.propTypes, updaterMap, this.props, drawingManager)
    drawingManager.setMap(this.context[MAP])
    this.state = {
      [DRAWING_MANAGER]: drawingManager,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[DRAWING_MANAGER], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[DRAWING_MANAGER],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const drawingManager = this.state[DRAWING_MANAGER]
    if (drawingManager) {
      drawingManager.setMap(null)
    }
  }

  render() {
    return false
  }
}

export default DrawingManager

const eventMap = {}

const updaterMap = {}
