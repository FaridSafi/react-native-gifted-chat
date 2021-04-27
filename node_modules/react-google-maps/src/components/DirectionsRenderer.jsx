/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
/* global google */
import React from "react"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { MAP, DIRECTIONS_RENDERER } from "../constants"

/**
 * A wrapper around `google.maps.DirectionsRenderer`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsRenderer
 */
export class DirectionsRenderer extends React.PureComponent {
  static propTypes = {
    /**
     * @type DirectionsResult
     */
    defaultDirections: PropTypes.any,

    /**
     * @type DirectionsRendererOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type Node
     */
    defaultPanel: PropTypes.any,

    /**
     * @type number
     */
    defaultRouteIndex: PropTypes.number,

    /**
     * @type DirectionsResult
     */
    directions: PropTypes.any,

    /**
     * @type DirectionsRendererOptions
     */
    options: PropTypes.any,

    /**
     * @type Node
     */
    panel: PropTypes.any,

    /**
     * @type number
     */
    routeIndex: PropTypes.number,

    /**
     * function
     */
    onDirectionsChanged: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsRenderer
   */
  constructor(props, context) {
    super(props, context)
    const directionsRenderer = new google.maps.DirectionsRenderer()
    construct(
      DirectionsRenderer.propTypes,
      updaterMap,
      this.props,
      directionsRenderer
    )
    directionsRenderer.setMap(this.context[MAP])
    this.state = {
      [DIRECTIONS_RENDERER]: directionsRenderer,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[DIRECTIONS_RENDERER], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[DIRECTIONS_RENDERER],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const directionsRenderer = this.state[DIRECTIONS_RENDERER]
    if (directionsRenderer) {
      directionsRenderer.setMap(null)
    }
  }

  render() {
    return false
  }

  /**
   * Returns the renderer's current set of directions.
   * @type DirectionsResult
   * @public
   */
  getDirections() {
    return this.state[DIRECTIONS_RENDERER].getDirections()
  }

  /**
   * Returns the panel `<div>` in which the `DirectionsResult` is rendered.
   * @type Node<div>DirectionsResult
   * @public
   */
  getPanel() {
    return this.state[DIRECTIONS_RENDERER].getPanel()
  }

  /**
   * Returns the current (zero-based) route index in use by this `DirectionsRenderer` object.
   * @type numberDirectionsRenderer
   * @public
   */
  getRouteIndex() {
    return this.state[DIRECTIONS_RENDERER].getRouteIndex()
  }
}

export default DirectionsRenderer

const eventMap = {
  onDirectionsChanged: "directions_changed",
}

const updaterMap = {
  directions(instance, directions) {
    instance.setDirections(directions)
  },

  options(instance, options) {
    instance.setOptions(options)
  },

  panel(instance, panel) {
    instance.setPanel(panel)
  },

  routeIndex(instance, routeIndex) {
    instance.setRouteIndex(routeIndex)
  },
}
