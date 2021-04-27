/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
/* global google */
import _ from "lodash"
import invariant from "invariant"
import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import {
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { getOffsetOverride, getLayoutStyles } from "../utils/OverlayViewHelper"

import { MAP, ANCHOR, OVERLAY_VIEW } from "../constants"

/**
 * A wrapper around `google.maps.OverlayView`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
 */
export class OverlayView extends React.PureComponent {
  static FLOAT_PANE = `floatPane`
  static MAP_PANE = `mapPane`
  static MARKER_LAYER = `markerLayer`
  static OVERLAY_LAYER = `overlayLayer`
  static OVERLAY_MOUSE_TARGET = `overlayMouseTarget`

  static propTypes = {
    /**
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
     */
    mapPaneName: PropTypes.string,

    /**
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
     */
    position: PropTypes.object,

    /**
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
     */
    bounds: PropTypes.object,

    /**
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
     */
    children: PropTypes.node.isRequired,

    /**
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
     */
    getPixelPositionOffset: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
    [ANCHOR]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView
   */
  constructor(props, context) {
    super(props, context)
    const overlayView = new google.maps.OverlayView()
    // You must implement three methods: onAdd(), draw(), and onRemove().
    overlayView.onAdd = _.bind(this.onAdd, this)
    overlayView.draw = _.bind(this.draw, this)
    overlayView.onRemove = _.bind(this.onRemove, this)
    this.onPositionElement = _.bind(this.onPositionElement, this)
    // You must call setMap() with a valid Map object to trigger the call to
    // the onAdd() method and setMap(null) in order to trigger the onRemove() method.
    overlayView.setMap(this.context[MAP])
    this.state = {
      [OVERLAY_VIEW]: overlayView,
    }
  }

  onAdd() {
    this.containerElement = document.createElement(`div`)
    this.containerElement.style.position = `absolute`
  }

  draw() {
    const { mapPaneName } = this.props
    invariant(
      !!mapPaneName,
      `OverlayView requires either props.mapPaneName or props.defaultMapPaneName but got %s`,
      mapPaneName
    )
    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapPanes
    const mapPanes = this.state[OVERLAY_VIEW].getPanes()
    mapPanes[mapPaneName].appendChild(this.containerElement)

    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      React.Children.only(this.props.children),
      this.containerElement,
      this.onPositionElement
    )
  }

  onPositionElement() {
    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapCanvasProjection
    const mapCanvasProjection = this.state[OVERLAY_VIEW].getProjection()

    const offset = {
      x: 0,
      y: 0,
      ...getOffsetOverride(this.containerElement, this.props),
    }
    const layoutStyles = getLayoutStyles(
      mapCanvasProjection,
      offset,
      this.props
    )
    _.assign(this.containerElement.style, layoutStyles)
  }

  onRemove() {
    this.containerElement.parentNode.removeChild(this.containerElement)
    ReactDOM.unmountComponentAtNode(this.containerElement)
    this.containerElement = null
  }

  componentDidMount() {
    componentDidMount(this, this.state[OVERLAY_VIEW], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[OVERLAY_VIEW],
      eventMap,
      updaterMap,
      prevProps
    )
    _.delay(this.state[OVERLAY_VIEW].draw)
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const overlayView = this.state[OVERLAY_VIEW]
    if (overlayView) {
      overlayView.setMap(null)
      // You must implement three methods: onAdd(), draw(), and onRemove().
      overlayView.onAdd = null
      overlayView.draw = null
      overlayView.onRemove = null
    }
  }

  render() {
    return false
  }

  /**
   * Returns the panes in which this OverlayView can be rendered. The panes are not initialized until `onAdd` is called by the API.
   * @type MapPanesonAdd
   * @public
   */
  getPanes() {
    return this.state[OVERLAY_VIEW].getPanes()
  }

  /**
   * Returns the `MapCanvasProjection` object associated with this `OverlayView`. The projection is not initialized until `onAdd` is called by the API.
   * @type MapCanvasProjectionMapCanvasProjectionOverlayViewonAdd
   * @public
   */
  getProjection() {
    return this.state[OVERLAY_VIEW].getProjection()
  }
}

export default OverlayView

const eventMap = {}

const updaterMap = {}
