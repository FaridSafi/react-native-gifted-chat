/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
import invariant from "invariant"
import React from "react"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { MAP } from "../constants"

/**
 * A wrapper around `google.maps.StreetViewPanorama`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanorama
 */
export class StreetViewPanorama extends React.PureComponent {
  static propTypes = {
    /**
     * @type Array<StreetViewLink>
     */
    defaultLinks: PropTypes.any,

    /**
     * @type boolean
     */
    defaultMotionTracking: PropTypes.bool,

    /**
     * @type StreetViewPanoramaOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type string
     */
    defaultPano: PropTypes.string,

    /**
     * @type LatLng|LatLngLiteral
     */
    defaultPosition: PropTypes.any,

    /**
     * @type StreetViewPov
     */
    defaultPov: PropTypes.any,

    /**
     * @type boolean
     */
    defaultVisible: PropTypes.bool,

    /**
     * @type number
     */
    defaultZoom: PropTypes.number,

    /**
     * @type Array<StreetViewLink>
     */
    links: PropTypes.any,

    /**
     * @type boolean
     */
    motionTracking: PropTypes.bool,

    /**
     * @type StreetViewPanoramaOptions
     */
    options: PropTypes.any,

    /**
     * @type string
     */
    pano: PropTypes.string,

    /**
     * @type LatLng|LatLngLiteral
     */
    position: PropTypes.any,

    /**
     * @type StreetViewPov
     */
    pov: PropTypes.any,

    /**
     * @type boolean
     */
    visible: PropTypes.bool,

    /**
     * @type number
     */
    zoom: PropTypes.number,

    /**
     * function
     */
    onCloseClick: PropTypes.func,

    /**
     * function
     */
    onPanoChanged: PropTypes.func,

    /**
     * function
     */
    onPositionChanged: PropTypes.func,

    /**
     * function
     */
    onPovChanged: PropTypes.func,

    /**
     * function
     */
    onResize: PropTypes.func,

    /**
     * function
     */
    onStatusChanged: PropTypes.func,

    /**
     * function
     */
    onVisibleChanged: PropTypes.func,

    /**
     * function
     */
    onZoomChanged: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  static childContextTypes = {
    [MAP]: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    invariant(
      !!this.context[MAP],
      `Did you render <StreetViewPanorama> as a child of <GoogleMap> with withGoogleMap() HOC?`
    )
    construct(
      StreetViewPanorama.propTypes,
      updaterMap,
      this.props,
      this.context[MAP].getStreetView()
    )
  }

  getChildContext() {
    return {
      [MAP]: this.context[MAP].getStreetView(),
    }
  }

  componentDidMount() {
    componentDidMount(this, this.context[MAP].getStreetView(), eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.context[MAP].getStreetView(),
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const streetViewPanorama = this.context[MAP].getStreetView()
    if (streetViewPanorama) {
      streetViewPanorama.setVisible(false)
    }
  }

  render() {
    const { children } = this.props
    return <div>{children}</div>
  }

  /**
   * Returns the set of navigation links for the Street View panorama.
   * @type Array<StreetViewLink>
   * @public
   */
  getLinks() {
    return this.context[MAP].getLinks()
  }

  /**
   * Returns the StreetViewLocation of the current panorama.
   * @type StreetViewLocation
   * @public
   */
  getLocation() {
    return this.context[MAP].getLocation()
  }

  /**
   * Returns the state of motion tracker. If true when the user physically moves the device and the browser supports it, the Street View Panorama tracks the physical movements.
   * @type boolean
   * @public
   */
  getMotionTracking() {
    return this.context[MAP].getMotionTracking()
  }

  /**
   * Returns the current panorama ID for the Street View panorama. This id is stable within the browser's current session only.
   * @type string
   * @public
   */
  getPano() {
    return this.context[MAP].getPano()
  }

  /**
   * Returns the heading and pitch of the photographer when this panorama was taken. For Street View panoramas on the road, this also reveals in which direction the car was travelling. This data is available after the `pano_changed` event.
   * @type StreetViewPovpano_changed
   * @public
   */
  getPhotographerPov() {
    return this.context[MAP].getPhotographerPov()
  }

  /**
   * Returns the current `LatLng` position for the Street View panorama.
   * @type LatLngLatLng
   * @public
   */
  getPosition() {
    return this.context[MAP].getPosition()
  }

  /**
   * Returns the current point of view for the Street View panorama.
   * @type StreetViewPov
   * @public
   */
  getPov() {
    return this.context[MAP].getPov()
  }

  /**
   * Returns the status of the panorama on completion of the `setPosition()` or `setPano()` request.
   * @type StreetViewStatussetPosition()setPano()
   * @public
   */
  getStatus() {
    return this.context[MAP].getStatus()
  }

  /**
   * Returns `true` if the panorama is visible. It does not specify whether Street View imagery is available at the specified position.
   * @type booleantrue
   * @public
   */
  getVisible() {
    return this.context[MAP].getVisible()
  }

  /**
   * Returns the zoom level of the panorama. Fully zoomed-out is level 0, where the field of view is 180 degrees. Zooming in increases the zoom level.
   * @type number
   * @public
   */
  getZoom() {
    return this.context[MAP].getZoom()
  }
}

export default StreetViewPanorama

const eventMap = {
  onCloseClick: "closeclick",
  onPanoChanged: "pano_changed",
  onPositionChanged: "position_changed",
  onPovChanged: "pov_changed",
  onResize: "resize",
  onStatusChanged: "status_changed",
  onVisibleChanged: "visible_changed",
  onZoomChanged: "zoom_changed",
}

const updaterMap = {
  links(instance, links) {
    instance.setLinks(links)
  },

  motionTracking(instance, motionTracking) {
    instance.setMotionTracking(motionTracking)
  },

  options(instance, options) {
    instance.setOptions(options)
  },

  pano(instance, pano) {
    instance.setPano(pano)
  },

  position(instance, position) {
    instance.setPosition(position)
  },

  pov(instance, pov) {
    instance.setPov(pov)
  },

  visible(instance, visible) {
    instance.setVisible(visible)
  },

  zoom(instance, zoom) {
    instance.setZoom(zoom)
  },
}
