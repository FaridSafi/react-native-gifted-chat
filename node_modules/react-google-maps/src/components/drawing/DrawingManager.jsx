/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
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

/**
 * A wrapper around `google.maps.drawing.DrawingManager`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
 */
export class DrawingManager extends React.PureComponent {
  static propTypes = {
    /**
     * @type OverlayType
     */
    defaultDrawingMode: PropTypes.any,

    /**
     * @type DrawingManagerOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type OverlayType
     */
    drawingMode: PropTypes.any,

    /**
     * @type DrawingManagerOptions
     */
    options: PropTypes.any,

    /**
     * function
     */
    onCircleComplete: PropTypes.func,

    /**
     * function
     */
    onMarkerComplete: PropTypes.func,

    /**
     * function
     */
    onOverlayComplete: PropTypes.func,

    /**
     * function
     */
    onPolygonComplete: PropTypes.func,

    /**
     * function
     */
    onPolylineComplete: PropTypes.func,

    /**
     * function
     */
    onRectangleComplete: PropTypes.func,
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

  /**
   * Returns the `DrawingManager`'s drawing mode.
   * @type OverlayTypeDrawingManager
   * @public
   */
  getDrawingMode() {
    return this.state[DRAWING_MANAGER].getDrawingMode()
  }
}

export default DrawingManager

const eventMap = {
  onCircleComplete: "circlecomplete",
  onMarkerComplete: "markercomplete",
  onOverlayComplete: "overlaycomplete",
  onPolygonComplete: "polygoncomplete",
  onPolylineComplete: "polylinecomplete",
  onRectangleComplete: "rectanglecomplete",
}

const updaterMap = {
  drawingMode(instance, drawingMode) {
    instance.setDrawingMode(drawingMode)
  },

  options(instance, options) {
    instance.setOptions(options)
  },
}
