/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
/* global google */
import React from "react"
import PropTypes from "prop-types"
import makeMarkerWithLabel from "markerwithlabel"
import ReactDOM from "react-dom"

import {
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
  construct,
} from "../../utils/MapChildHelper"

import { MAP, MARKER_CLUSTERER, MARKER_WITH_LABEL } from "../../constants"

/**
 * A wrapper around `MarkerWithLabel`
 *
 * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
 */
export class MarkerWithLabel extends React.PureComponent {
  static propTypes = {
    /**
     * It will be `MarkerWithLabel#labelContent`.
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    children: PropTypes.node,

    /**
     * For `MarkerWithLabel`
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelAnchor: PropTypes.object,

    /**
     * For `MarkerWithLabel`
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelClass: PropTypes.string,

    /**
     * For `MarkerWithLabel`. This is for native JS style object, so you may
     * expect some React shorthands for inline styles not working here.
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelStyle: PropTypes.object,

    /**
     * For `MarkerWithLabel`
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelVisible: PropTypes.bool,

    /**
     * For the 2nd argument of `MarkerCluster#addMarker`
     * @see https://github.com/mikesaidani/marker-clusterer-plus
     */
    noRedraw: PropTypes.bool,

    /**
     * @type Animation
     */
    defaultAnimation: PropTypes.any,

    /**
     * @type boolean
     */
    defaultClickable: PropTypes.bool,

    /**
     * @type string
     */
    defaultCursor: PropTypes.string,

    /**
     * @type boolean
     */
    defaultDraggable: PropTypes.bool,

    /**
     * @type string|Icon|Symbol
     */
    defaultIcon: PropTypes.any,

    /**
     * @type string|MarkerLabel
     */
    defaultLabel: PropTypes.any,

    /**
     * @type number
     */
    defaultOpacity: PropTypes.number,

    /**
     * @type MarkerOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type MarkerPlace
     */
    defaultPlace: PropTypes.any,

    /**
     * @type LatLng|LatLngLiteral
     */
    defaultPosition: PropTypes.any,

    /**
     * @type MarkerShape
     */
    defaultShape: PropTypes.any,

    /**
     * @type string
     */
    defaultTitle: PropTypes.string,

    /**
     * @type boolean
     */
    defaultVisible: PropTypes.bool,

    /**
     * @type number
     */
    defaultZIndex: PropTypes.number,

    /**
     * @type Animation
     */
    animation: PropTypes.any,

    /**
     * @type boolean
     */
    clickable: PropTypes.bool,

    /**
     * @type string
     */
    cursor: PropTypes.string,

    /**
     * @type boolean
     */
    draggable: PropTypes.bool,

    /**
     * @type string|Icon|Symbol
     */
    icon: PropTypes.any,

    /**
     * @type string|MarkerLabel
     */
    label: PropTypes.any,

    /**
     * @type number
     */
    opacity: PropTypes.number,

    /**
     * @type MarkerOptions
     */
    options: PropTypes.any,

    /**
     * @type MarkerPlace
     */
    place: PropTypes.any,

    /**
     * @type LatLng|LatLngLiteral
     */
    position: PropTypes.any,

    /**
     * @type MarkerShape
     */
    shape: PropTypes.any,

    /**
     * @type string
     */
    title: PropTypes.string,

    /**
     * @type boolean
     */
    visible: PropTypes.bool,

    /**
     * @type number
     */
    zIndex: PropTypes.number,

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
    onAnimationChanged: PropTypes.func,

    /**
     * function
     */
    onClick: PropTypes.func,

    /**
     * function
     */
    onClickableChanged: PropTypes.func,

    /**
     * function
     */
    onCursorChanged: PropTypes.func,

    /**
     * function
     */
    onDrag: PropTypes.func,

    /**
     * function
     */
    onDraggableChanged: PropTypes.func,

    /**
     * function
     */
    onFlatChanged: PropTypes.func,

    /**
     * function
     */
    onIconChanged: PropTypes.func,

    /**
     * function
     */
    onPositionChanged: PropTypes.func,

    /**
     * function
     */
    onShapeChanged: PropTypes.func,

    /**
     * function
     */
    onTitleChanged: PropTypes.func,

    /**
     * function
     */
    onVisibleChanged: PropTypes.func,

    /**
     * function
     */
    onZindexChanged: PropTypes.func,
  }

  static defaultProps = {
    labelVisible: true,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
    [MARKER_CLUSTERER]: PropTypes.object,
  }

  /*
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  constructor(props, context) {
    super(props, context)
    const NativeMarkerWithLabel = makeMarkerWithLabel(google.maps)
    const markerWithLabel = new NativeMarkerWithLabel()
    construct(
      MarkerWithLabel.propTypes,
      updaterMap,
      this.props,
      markerWithLabel
    )
    const markerClusterer = this.context[MARKER_CLUSTERER]
    if (markerClusterer) {
      markerClusterer.addMarker(markerWithLabel, !!this.props.noRedraw)
    } else {
      markerWithLabel.setMap(this.context[MAP])
    }
    this.state = {
      [MARKER_WITH_LABEL]: markerWithLabel,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[MARKER_WITH_LABEL], eventMap)
    const container = document.createElement(`div`)
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      React.Children.only(this.props.children),
      container
    )
    this.state[MARKER_WITH_LABEL].set(`labelContent`, container)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[MARKER_WITH_LABEL],
      eventMap,
      updaterMap,
      prevProps
    )
    if (this.props.children !== prevProps.children) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        React.Children.only(this.props.children),
        this.state[MARKER_WITH_LABEL].get("labelContent")
      )
    }
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const markerWithLabel = this.state[MARKER_WITH_LABEL]
    if (markerWithLabel) {
      const markerClusterer = this.context[MARKER_CLUSTERER]
      if (markerClusterer) {
        markerClusterer.removeMarker(markerWithLabel, !!this.props.noRedraw)
      }
      if (markerWithLabel.get("labelContent")) {
        ReactDOM.unmountComponentAtNode(markerWithLabel.get("labelContent"))
      }
      markerWithLabel.setMap(null)
    }
  }

  render() {
    return false
  }

  /**
   *
   * @type Animation
   * @public
   */
  getAnimation() {
    return this.state[MARKER_WITH_LABEL].getAnimation()
  }

  /**
   *
   * @type boolean
   * @public
   */
  getClickable() {
    return this.state[MARKER_WITH_LABEL].getClickable()
  }

  /**
   *
   * @type string
   * @public
   */
  getCursor() {
    return this.state[MARKER_WITH_LABEL].getCursor()
  }

  /**
   *
   * @type boolean
   * @public
   */
  getDraggable() {
    return this.state[MARKER_WITH_LABEL].getDraggable()
  }

  /**
   *
   * @type string|Icon|Symbol
   * @public
   */
  getIcon() {
    return this.state[MARKER_WITH_LABEL].getIcon()
  }

  /**
   *
   * @type MarkerLabel
   * @public
   */
  getLabel() {
    return this.state[MARKER_WITH_LABEL].getLabel()
  }

  /**
   *
   * @type number
   * @public
   */
  getOpacity() {
    return this.state[MARKER_WITH_LABEL].getOpacity()
  }

  /**
   *
   * @type MarkerPlace
   * @public
   */
  getPlace() {
    return this.state[MARKER_WITH_LABEL].getPlace()
  }

  /**
   *
   * @type LatLng
   * @public
   */
  getPosition() {
    return this.state[MARKER_WITH_LABEL].getPosition()
  }

  /**
   *
   * @type MarkerShape
   * @public
   */
  getShape() {
    return this.state[MARKER_WITH_LABEL].getShape()
  }

  /**
   *
   * @type string
   * @public
   */
  getTitle() {
    return this.state[MARKER_WITH_LABEL].getTitle()
  }

  /**
   *
   * @type boolean
   * @public
   */
  getVisible() {
    return this.state[MARKER_WITH_LABEL].getVisible()
  }

  /**
   *
   * @type number
   * @public
   */
  getZIndex() {
    return this.state[MARKER_WITH_LABEL].getZIndex()
  }
}

export default MarkerWithLabel

const eventMap = {
  onDblClick: "dblclick",
  onDragEnd: "dragend",
  onDragStart: "dragstart",
  onMouseDown: "mousedown",
  onMouseOut: "mouseout",
  onMouseOver: "mouseover",
  onMouseUp: "mouseup",
  onRightClick: "rightclick",
  onAnimationChanged: "animation_changed",
  onClick: "click",
  onClickableChanged: "clickable_changed",
  onCursorChanged: "cursor_changed",
  onDrag: "drag",
  onDraggableChanged: "draggable_changed",
  onFlatChanged: "flat_changed",
  onIconChanged: "icon_changed",
  onPositionChanged: "position_changed",
  onShapeChanged: "shape_changed",
  onTitleChanged: "title_changed",
  onVisibleChanged: "visible_changed",
  onZindexChanged: "zindex_changed",
}

const updaterMap = {
  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelAnchor(instance, labelAnchor) {
    instance.set(`labelAnchor`, labelAnchor)
  },

  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelClass(instance, labelClass) {
    instance.set(`labelClass`, labelClass)
  },

  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelStyle(instance, labelStyle) {
    instance.set(`labelStyle`, labelStyle)
  },

  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelVisible(instance, labelVisible) {
    instance.set(`labelVisible`, labelVisible)
  },

  animation(instance, animation) {
    instance.setAnimation(animation)
  },

  clickable(instance, clickable) {
    instance.setClickable(clickable)
  },

  cursor(instance, cursor) {
    instance.setCursor(cursor)
  },

  draggable(instance, draggable) {
    instance.setDraggable(draggable)
  },

  icon(instance, icon) {
    instance.setIcon(icon)
  },

  label(instance, label) {
    instance.setLabel(label)
  },

  opacity(instance, opacity) {
    instance.setOpacity(opacity)
  },

  options(instance, options) {
    instance.setOptions(options)
  },

  place(instance, place) {
    instance.setPlace(place)
  },

  position(instance, position) {
    instance.setPosition(position)
  },

  shape(instance, shape) {
    instance.setShape(shape)
  },

  title(instance, title) {
    instance.setTitle(title)
  },

  visible(instance, visible) {
    instance.setVisible(visible)
  },

  zIndex(instance, zIndex) {
    instance.setZIndex(zIndex)
  },
}
