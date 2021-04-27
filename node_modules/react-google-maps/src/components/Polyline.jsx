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

import { MAP, POLYLINE } from "../constants"

/**
 * A wrapper around `google.maps.Polyline`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline
 */
export class Polyline extends React.PureComponent {
  static propTypes = {
    /**
     * @type boolean
     */
    defaultDraggable: PropTypes.bool,

    /**
     * @type boolean
     */
    defaultEditable: PropTypes.bool,

    /**
     * @type PolylineOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type MVCArray<LatLng>|Array<LatLng|LatLngLiteral>
     */
    defaultPath: PropTypes.any,

    /**
     * @type boolean
     */
    defaultVisible: PropTypes.bool,

    /**
     * @type boolean
     */
    draggable: PropTypes.bool,

    /**
     * @type boolean
     */
    editable: PropTypes.bool,

    /**
     * @type PolylineOptions
     */
    options: PropTypes.any,

    /**
     * @type MVCArray<LatLng>|Array<LatLng|LatLngLiteral>
     */
    path: PropTypes.any,

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
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline
   */
  constructor(props, context) {
    super(props, context)
    const polyline = new google.maps.Polyline()
    construct(Polyline.propTypes, updaterMap, this.props, polyline)
    polyline.setMap(this.context[MAP])
    this.state = {
      [POLYLINE]: polyline,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[POLYLINE], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[POLYLINE],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const polyline = this.state[POLYLINE]
    if (polyline) {
      polyline.setMap(null)
    }
  }

  render() {
    return false
  }

  /**
   * Returns whether this shape can be dragged by the user.
   * @type boolean
   * @public
   */
  getDraggable() {
    return this.state[POLYLINE].getDraggable()
  }

  /**
   * Returns whether this shape can be edited by the user.
   * @type boolean
   * @public
   */
  getEditable() {
    return this.state[POLYLINE].getEditable()
  }

  /**
   * Retrieves the path.
   * @type MVCArray<LatLng>
   * @public
   */
  getPath() {
    return this.state[POLYLINE].getPath()
  }

  /**
   * Returns whether this poly is visible on the map.
   * @type boolean
   * @public
   */
  getVisible() {
    return this.state[POLYLINE].getVisible()
  }
}

export default Polyline

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
  onClick: "click",
  onDrag: "drag",
}

const updaterMap = {
  draggable(instance, draggable) {
    instance.setDraggable(draggable)
  },

  editable(instance, editable) {
    instance.setEditable(editable)
  },

  options(instance, options) {
    instance.setOptions(options)
  },

  path(instance, path) {
    instance.setPath(path)
  },

  visible(instance, visible) {
    instance.setVisible(visible)
  },
}
