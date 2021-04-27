"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.Circle = undefined

var _defineProperty2 = require("babel-runtime/helpers/defineProperty")

var _defineProperty3 = _interopRequireDefault(_defineProperty2)

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of")

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf)

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck")

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2)

var _createClass2 = require("babel-runtime/helpers/createClass")

var _createClass3 = _interopRequireDefault(_createClass2)

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn")

var _possibleConstructorReturn3 = _interopRequireDefault(
  _possibleConstructorReturn2
)

var _inherits2 = require("babel-runtime/helpers/inherits")

var _inherits3 = _interopRequireDefault(_inherits2)

var _react = require("react")

var _react2 = _interopRequireDefault(_react)

var _propTypes = require("prop-types")

var _propTypes2 = _interopRequireDefault(_propTypes)

var _MapChildHelper = require("../utils/MapChildHelper")

var _constants = require("../constants")

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/**
 * A wrapper around `google.maps.Circle`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
 */
/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
/* global google */
var Circle = (exports.Circle = (function(_React$PureComponent) {
  ;(0, _inherits3.default)(Circle, _React$PureComponent)

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle
   */
  function Circle(props, context) {
    ;(0, _classCallCheck3.default)(this, Circle)

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (Circle.__proto__ || (0, _getPrototypeOf2.default)(Circle)).call(
        this,
        props,
        context
      )
    )

    var circle = new google.maps.Circle()
    ;(0, _MapChildHelper.construct)(
      Circle.propTypes,
      updaterMap,
      _this.props,
      circle
    )
    circle.setMap(_this.context[_constants.MAP])
    _this.state = (0, _defineProperty3.default)({}, _constants.CIRCLE, circle)
    return _this
  }

  ;(0, _createClass3.default)(Circle, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        ;(0, _MapChildHelper.componentDidMount)(
          this,
          this.state[_constants.CIRCLE],
          eventMap
        )
      },
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        ;(0, _MapChildHelper.componentDidUpdate)(
          this,
          this.state[_constants.CIRCLE],
          eventMap,
          updaterMap,
          prevProps
        )
      },
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        ;(0, _MapChildHelper.componentWillUnmount)(this)
        var circle = this.state[_constants.CIRCLE]
        if (circle) {
          circle.setMap(null)
        }
      },
    },
    {
      key: "render",
      value: function render() {
        return false
      },

      /**
       * Gets the `LatLngBounds` of this Circle.
       * @type LatLngBoundsLatLngBounds
       * @public
       */
    },
    {
      key: "getBounds",
      value: function getBounds() {
        return this.state[_constants.CIRCLE].getBounds()
      },

      /**
       * Returns the center of this circle.
       * @type LatLng
       * @public
       */
    },
    {
      key: "getCenter",
      value: function getCenter() {
        return this.state[_constants.CIRCLE].getCenter()
      },

      /**
       * Returns whether this circle can be dragged by the user.
       * @type boolean
       * @public
       */
    },
    {
      key: "getDraggable",
      value: function getDraggable() {
        return this.state[_constants.CIRCLE].getDraggable()
      },

      /**
       * Returns whether this circle can be edited by the user.
       * @type boolean
       * @public
       */
    },
    {
      key: "getEditable",
      value: function getEditable() {
        return this.state[_constants.CIRCLE].getEditable()
      },

      /**
       * Returns the radius of this circle (in meters).
       * @type number
       * @public
       */
    },
    {
      key: "getRadius",
      value: function getRadius() {
        return this.state[_constants.CIRCLE].getRadius()
      },

      /**
       * Returns whether this circle is visible on the map.
       * @type boolean
       * @public
       */
    },
    {
      key: "getVisible",
      value: function getVisible() {
        return this.state[_constants.CIRCLE].getVisible()
      },
    },
  ])
  return Circle
})(_react2.default.PureComponent))

Circle.propTypes = {
  /**
   * @type LatLng|LatLngLiteral
   */
  defaultCenter: _propTypes2.default.any,

  /**
   * @type boolean
   */
  defaultDraggable: _propTypes2.default.bool,

  /**
   * @type boolean
   */
  defaultEditable: _propTypes2.default.bool,

  /**
   * @type CircleOptions
   */
  defaultOptions: _propTypes2.default.any,

  /**
   * @type number
   */
  defaultRadius: _propTypes2.default.number,

  /**
   * @type boolean
   */
  defaultVisible: _propTypes2.default.bool,

  /**
   * @type LatLng|LatLngLiteral
   */
  center: _propTypes2.default.any,

  /**
   * @type boolean
   */
  draggable: _propTypes2.default.bool,

  /**
   * @type boolean
   */
  editable: _propTypes2.default.bool,

  /**
   * @type CircleOptions
   */
  options: _propTypes2.default.any,

  /**
   * @type number
   */
  radius: _propTypes2.default.number,

  /**
   * @type boolean
   */
  visible: _propTypes2.default.bool,

  /**
   * function
   */
  onDblClick: _propTypes2.default.func,

  /**
   * function
   */
  onDragEnd: _propTypes2.default.func,

  /**
   * function
   */
  onDragStart: _propTypes2.default.func,

  /**
   * function
   */
  onMouseDown: _propTypes2.default.func,

  /**
   * function
   */
  onMouseMove: _propTypes2.default.func,

  /**
   * function
   */
  onMouseOut: _propTypes2.default.func,

  /**
   * function
   */
  onMouseOver: _propTypes2.default.func,

  /**
   * function
   */
  onMouseUp: _propTypes2.default.func,

  /**
   * function
   */
  onRightClick: _propTypes2.default.func,

  /**
   * function
   */
  onCenterChanged: _propTypes2.default.func,

  /**
   * function
   */
  onClick: _propTypes2.default.func,

  /**
   * function
   */
  onDrag: _propTypes2.default.func,

  /**
   * function
   */
  onRadiusChanged: _propTypes2.default.func,
}
Circle.contextTypes = (0, _defineProperty3.default)(
  {},
  _constants.MAP,
  _propTypes2.default.object
)
exports.default = Circle

var eventMap = {
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

var updaterMap = {
  center: function center(instance, _center) {
    instance.setCenter(_center)
  },
  draggable: function draggable(instance, _draggable) {
    instance.setDraggable(_draggable)
  },
  editable: function editable(instance, _editable) {
    instance.setEditable(_editable)
  },
  options: function options(instance, _options) {
    instance.setOptions(_options)
  },
  radius: function radius(instance, _radius) {
    instance.setRadius(_radius)
  },
  visible: function visible(instance, _visible) {
    instance.setVisible(_visible)
  },
}
