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

import { MAP, CIRCLE } from "../constants"

/**
 * A wrapper around `google.maps.Circle`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
 */
export class Circle extends React.PureComponent {
  static propTypes = {
    /**
     * @type LatLng|LatLngLiteral
     */
    defaultCenter: PropTypes.any,

    /**
     * @type boolean
     */
    defaultDraggable: PropTypes.bool,

    /**
     * @type boolean
     */
    defaultEditable: PropTypes.bool,

    /**
     * @type CircleOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type number
     */
    defaultRadius: PropTypes.number,

    /**
     * @type boolean
     */
    defaultVisible: PropTypes.bool,

    /**
     * @type LatLng|LatLngLiteral
     */
    center: PropTypes.any,

    /**
     * @type boolean
     */
    draggable: PropTypes.bool,

    /**
     * @type boolean
     */
    editable: PropTypes.bool,

    /**
     * @type CircleOptions
     */
    options: PropTypes.any,

    /**
     * @type number
     */
    radius: PropTypes.number,

    /**
     * @type boolean
     */
    visible: PropTypes.bool,

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
    onMouseDown: PropTypes.func,

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
    onMouseUp: PropTypes.func,

    /**
     * function
     */
    onRightClick: PropTypes.func,

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
    onRadiusChanged: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
   */
  constructor(props, context) {
    super(props, context)
    const circle = new google.maps.Circle()
    construct(Circle.propTypes, updaterMap, this.props, circle)
    circle.setMap(this.context[MAP])
    this.state = {
      [CIRCLE]: circle,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[CIRCLE], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[CIRCLE],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const circle = this.state[CIRCLE]
    if (circle) {
      circle.setMap(null)
    }
  }

  render() {
    return false
  }

  /**
   * Gets the `LatLngBounds` of this Circle.
   * @type LatLngBoundsLatLngBounds
   * @public
   */
  getBounds() {
    return this.state[CIRCLE].getBounds()
  }

  /**
   * Returns the center of this circle.
   * @type LatLng
   * @public
   */
  getCenter() {
    return this.state[CIRCLE].getCenter()
  }

  /**
   * Returns whether this circle can be dragged by the user.
   * @type boolean
   * @public
   */
  getDraggable() {
    return this.state[CIRCLE].getDraggable()
  }

  /**
   * Returns whether this circle can be edited by the user.
   * @type boolean
   * @public
   */
  getEditable() {
    return this.state[CIRCLE].getEditable()
  }

  /**
   * Returns the radius of this circle (in meters).
   * @type number
   * @public
   */
  getRadius() {
    return this.state[CIRCLE].getRadius()
  }

  /**
   * Returns whether this circle is visible on the map.
   * @type boolean
   * @public
   */
  getVisible() {
    return this.state[CIRCLE].getVisible()
  }
}

export default Circle

const eventMap = {
  onDblClick: "dblclick",
  onDragEnd: "dragend",
  onDragStart: "dragstart",
  onMouseDown: "mousedown",
  onMouseMove: "mousemove",
  onMouseOut: "mouseout",
  onMouseOver: "mouseover",
  onMouseUp: "mouseup",
  onRightClick: "rightclick",
  onCenterChanged: "center_changed",
  onClick: "click",
  onDrag: "drag",
  onRadiusChanged: "radius_changed",
}

const updaterMap = {
  center(instance, center) {
    instance.setCenter(center)
  },

  draggable(instance, draggable) {
    instance.setDraggable(draggable)
  },

  editable(instance, editable) {
    instance.setEditable(editable)
  },

  options(instance, options) {
    instance.setOptions(options)
  },

  radius(instance, radius) {
    instance.setRadius(radius)
  },

  visible(instance, visible) {
    instance.setVisible(visible)
  },
}
