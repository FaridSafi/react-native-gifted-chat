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

import { MAP, RECTANGLE } from "../constants"

/**
 * A wrapper around `google.maps.Rectangle`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle
 */
export class Rectangle extends React.PureComponent {
  static propTypes = {
    /**
     * @type LatLngBounds|LatLngBoundsLiteral
     */
    defaultBounds: PropTypes.any,

    /**
     * @type boolean
     */
    defaultDraggable: PropTypes.bool,

    /**
     * @type boolean
     */
    defaultEditable: PropTypes.bool,

    /**
     * @type RectangleOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type boolean
     */
    defaultVisible: PropTypes.bool,

    /**
     * @type LatLngBounds|LatLngBoundsLiteral
     */
    bounds: PropTypes.any,

    /**
     * @type boolean
     */
    draggable: PropTypes.bool,

    /**
     * @type boolean
     */
    editable: PropTypes.bool,

    /**
     * @type RectangleOptions
     */
    options: PropTypes.any,

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
    onBoundsChanged: PropTypes.func,

    /**
     * function
     */
    onClick: PropTypes.func,

    /**
     * function
     */
    onDrag: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle
   */
  constructor(props, context) {
    super(props, context)
    const rectangle = new google.maps.Rectangle()
    construct(Rectangle.propTypes, updaterMap, this.props, rectangle)
    rectangle.setMap(this.context[MAP])
    this.state = {
      [RECTANGLE]: rectangle,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[RECTANGLE], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[RECTANGLE],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const rectangle = this.state[RECTANGLE]
    if (rectangle) {
      rectangle.setMap(null)
    }
  }

  render() {
    return false
  }

  /**
   * Returns the bounds of this rectangle.
   * @type LatLngBounds
   * @public
   */
  getBounds() {
    return this.state[RECTANGLE].getBounds()
  }

  /**
   * Returns whether this rectangle can be dragged by the user.
   * @type boolean
   * @public
   */
  getDraggable() {
    return this.state[RECTANGLE].getDraggable()
  }

  /**
   * Returns whether this rectangle can be edited by the user.
   * @type boolean
   * @public
   */
  getEditable() {
    return this.state[RECTANGLE].getEditable()
  }

  /**
   * Returns whether this rectangle is visible on the map.
   * @type boolean
   * @public
   */
  getVisible() {
    return this.state[RECTANGLE].getVisible()
  }
}

export default Rectangle

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
  onBoundsChanged: "bounds_changed",
  onClick: "click",
  onDrag: "drag",
}

const updaterMap = {
  bounds(instance, bounds) {
    instance.setBounds(bounds)
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

  visible(instance, visible) {
    instance.setVisible(visible)
  },
}
