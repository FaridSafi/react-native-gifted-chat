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
 * A wrapper around `google.maps.Map`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
 */
export class Map extends React.PureComponent {
  static displayName = "GoogleMap"

  static propTypes = {
    /**
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapTypeRegistry
     * @type Array<[id:string, mapType:MapType|*]>
     */
    defaultExtraMapTypes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),

    /**
     * @type LatLng|LatLngLiteral
     */
    defaultCenter: PropTypes.any,

    /**
     * @type boolean
     */
    defaultClickableIcons: PropTypes.bool,

    /**
     * @type number
     */
    defaultHeading: PropTypes.number,

    /**
     * @type MapTypeId|string
     */
    defaultMapTypeId: PropTypes.any,

    /**
     * @type MapOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type StreetViewPanorama
     */
    defaultStreetView: PropTypes.any,

    /**
     * @type number
     */
    defaultTilt: PropTypes.number,

    /**
     * @type number
     */
    defaultZoom: PropTypes.number,

    /**
     * @type LatLng|LatLngLiteral
     */
    center: PropTypes.any,

    /**
     * @type boolean
     */
    clickableIcons: PropTypes.bool,

    /**
     * @type number
     */
    heading: PropTypes.number,

    /**
     * @type MapTypeId|string
     */
    mapTypeId: PropTypes.any,

    /**
     * @type MapOptions
     */
    options: PropTypes.any,

    /**
     * @type StreetViewPanorama
     */
    streetView: PropTypes.any,

    /**
     * @type number
     */
    tilt: PropTypes.number,

    /**
     * @type number
     */
    zoom: PropTypes.number,

    /**
     * function
     */
    onDblClick: PropTypes.func,

    /**
     * function
     */
    onDragEnd: PropTypes.func,

    /**
     * function
     */
    onDragStart: PropTypes.func,

    /**
     * function
     */
    onMapTypeIdChanged: PropTypes.func,

    /**
     * function
     */
    onMouseMove: PropTypes.func,

    /**
     * function
     */
    onMouseOut: PropTypes.func,

    /**
     * function
     */
    onMouseOver: PropTypes.func,

    /**
     * function
     */
    onRightClick: PropTypes.func,

    /**
     * function
     */
    onTilesLoaded: PropTypes.func,

    /**
     * function
     */
    onBoundsChanged: PropTypes.func,

    /**
     * function
     */
    onCenterChanged: PropTypes.func,

    /**
     * function
     */
    onClick: PropTypes.func,

    /**
     * function
     */
    onDrag: PropTypes.func,

    /**
     * function
     */
    onHeadingChanged: PropTypes.func,

    /**
     * function
     */
    onIdle: PropTypes.func,

    /**
     * function
     */
    onProjectionChanged: PropTypes.func,

    /**
     * function
     */
    onResize: PropTypes.func,

    /**
     * function
     */
    onTiltChanged: PropTypes.func,

    /**
     * function
     */
    onZoomChanged: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /**
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
   * @public
   */
  fitBounds(...args) {
    return this.context[MAP].fitBounds(...args)
  }

  /**
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
   * @public
   */
  panBy(...args) {
    return this.context[MAP].panBy(...args)
  }

  /**
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
   * @public
   */
  panTo(...args) {
    return this.context[MAP].panTo(...args)
  }

  /**
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
   * @public
   */
  panToBounds(...args) {
    return this.context[MAP].panToBounds(...args)
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
   */
  constructor(props, context) {
    super(props, context)
    invariant(
      !!this.context[MAP],
      `Did you wrap <GoogleMap> component with withGoogleMap() HOC?`
    )
    construct(GoogleMap.propTypes, updaterMap, this.props, this.context[MAP])
  }

  componentDidMount() {
    componentDidMount(this, this.context[MAP], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(this, this.context[MAP], eventMap, updaterMap, prevProps)
  }

  componentWillUnmount() {
    componentWillUnmount(this)
  }

  render() {
    const { children } = this.props
    return <div>{children}</div>
  }

  /**
   * Returns the lat/lng bounds of the current viewport. If more than one copy of the world is visible, the bounds range in longitude from -180 to 180 degrees inclusive. If the map is not yet initialized (i.e. the mapType is still null), or center and zoom have not been set then the result is `null` or `undefined`.
   * @type LatLngBoundsnullundefined
   * @public
   */
  getBounds() {
    return this.context[MAP].getBounds()
  }

  /**
   * Returns the position displayed at the center of the map. Note that this `LatLng` object is _not_ wrapped. See `[LatLng](#LatLng)` for more information.
   * @type LatLngLatLngLatLng
   * @public
   */
  getCenter() {
    return this.context[MAP].getCenter()
  }

  /**
   * Returns the clickability of the map icons. A map icon represents a point of interest, also known as a POI. If the returned value is true, then the icons are clickable on the map.
   * @type boolean
   * @public
   */
  getClickableIcons() {
    return this.context[MAP].getClickableIcons()
  }

  /**
   *
   * @type Element
   * @public
   */
  getDiv() {
    return this.context[MAP].getDiv()
  }

  /**
   * Returns the compass heading of aerial imagery. The heading value is measured in degrees (clockwise) from cardinal direction North.
   * @type number
   * @public
   */
  getHeading() {
    return this.context[MAP].getHeading()
  }

  /**
   *
   * @type MapTypeId|string
   * @public
   */
  getMapTypeId() {
    return this.context[MAP].getMapTypeId()
  }

  /**
   * Returns the current `Projection`. If the map is not yet initialized (i.e. the mapType is still null) then the result is null. Listen to `projection_changed` and check its value to ensure it is not null.
   * @type ProjectionProjectionprojection_changed
   * @public
   */
  getProjection() {
    return this.context[MAP].getProjection()
  }

  /**
   * Returns the default `StreetViewPanorama` bound to the map, which may be a default panorama embedded within the map, or the panorama set using `setStreetView()`. Changes to the map's `streetViewControl` will be reflected in the display of such a bound panorama.
   * @type StreetViewPanoramaStreetViewPanoramasetStreetView()streetViewControl
   * @public
   */
  getStreetView() {
    return this.context[MAP].getStreetView()
  }

  /**
   * Returns the current angle of incidence of the map, in degrees from the viewport plane to the map plane. The result will be `0` for imagery taken directly overhead or `45` for 45° imagery. 45° imagery is only available for `satellite` and `hybrid` map types, within some locations, and at some zoom levels. **Note:** This method does not return the value set by `setTilt`. See `setTilt` for details.
   * @type number045satellitehybridsetTiltsetTilt
   * @public
   */
  getTilt() {
    return this.context[MAP].getTilt()
  }

  /**
   *
   * @type number
   * @public
   */
  getZoom() {
    return this.context[MAP].getZoom()
  }
}

export const GoogleMap = Map

export default Map

const eventMap = {
  onDblClick: "dblclick",
  onDragEnd: "dragend",
  onDragStart: "dragstart",
  onMapTypeIdChanged: "maptypeid_changed",
  onMouseMove: "mousemove",
  onMouseOut: "mouseout",
  onMouseOver: "mouseover",
  onRightClick: "rightclick",
  onTilesLoaded: "tilesloaded",
  onBoundsChanged: "bounds_changed",
  onCenterChanged: "center_changed",
  onClick: "click",
  onDrag: "drag",
  onHeadingChanged: "heading_changed",
  onIdle: "idle",
  onProjectionChanged: "projection_changed",
  onResize: "resize",
  onTiltChanged: "tilt_changed",
  onZoomChanged: "zoom_changed",
}

const updaterMap = {
  extraMapTypes(instance, extra) {
    extra.forEach(it => instance.mapTypes.set(...it))
  },

  center(instance, center) {
    instance.setCenter(center)
  },

  clickableIcons(instance, clickableIcons) {
    instance.setClickableIcons(clickableIcons)
  },

  heading(instance, heading) {
    instance.setHeading(heading)
  },

  mapTypeId(instance, mapTypeId) {
    instance.setMapTypeId(mapTypeId)
  },

  options(instance, options) {
    instance.setOptions(options)
  },

  streetView(instance, streetView) {
    instance.setStreetView(streetView)
  },

  tilt(instance, tilt) {
    instance.setTilt(tilt)
  },

  zoom(instance, zoom) {
    instance.setZoom(zoom)
  },
}
