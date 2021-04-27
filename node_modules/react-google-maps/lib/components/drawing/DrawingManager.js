"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.DrawingManager = undefined

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

var _invariant = require("invariant")

var _invariant2 = _interopRequireDefault(_invariant)

var _react = require("react")

var _react2 = _interopRequireDefault(_react)

var _propTypes = require("prop-types")

var _propTypes2 = _interopRequireDefault(_propTypes)

var _MapChildHelper = require("../../utils/MapChildHelper")

var _constants = require("../../constants")

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/**
 * A wrapper around `google.maps.drawing.DrawingManager`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
 */
var DrawingManager = (exports.DrawingManager = (function(_React$PureComponent) {
  ;(0, _inherits3.default)(DrawingManager, _React$PureComponent)

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#DrawingManager
   */
  function DrawingManager(props, context) {
    ;(0, _classCallCheck3.default)(this, DrawingManager)

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (
        DrawingManager.__proto__ ||
        (0, _getPrototypeOf2.default)(DrawingManager)
      ).call(this, props, context)
    )

    ;(0, _invariant2.default)(
      google.maps.drawing,
      'Did you include "libraries=drawing" in the URL?'
    )
    var drawingManager = new google.maps.drawing.DrawingManager()
    ;(0, _MapChildHelper.construct)(
      DrawingManager.propTypes,
      updaterMap,
      _this.props,
      drawingManager
    )
    drawingManager.setMap(_this.context[_constants.MAP])
    _this.state = (0, _defineProperty3.default)(
      {},
      _constants.DRAWING_MANAGER,
      drawingManager
    )
    return _this
  }

  ;(0, _createClass3.default)(DrawingManager, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        ;(0, _MapChildHelper.componentDidMount)(
          this,
          this.state[_constants.DRAWING_MANAGER],
          eventMap
        )
      },
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        ;(0, _MapChildHelper.componentDidUpdate)(
          this,
          this.state[_constants.DRAWING_MANAGER],
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
        var drawingManager = this.state[_constants.DRAWING_MANAGER]
        if (drawingManager) {
          drawingManager.setMap(null)
        }
      },
    },
    {
      key: "render",
      value: function render() {
        return false
      },

      /**
       * Returns the `DrawingManager`'s drawing mode.
       * @type OverlayTypeDrawingManager
       * @public
       */
    },
    {
      key: "getDrawingMode",
      value: function getDrawingMode() {
        return this.state[_constants.DRAWING_MANAGER].getDrawingMode()
      },
    },
  ])
  return DrawingManager
})(
  _react2.default.PureComponent
)) /*
                                   * -----------------------------------------------------------------------------
                                   * This file is auto-generated from the corresponding file at `src/macros/`.
                                   * Please **DO NOT** edit this file directly when creating PRs.
                                   * -----------------------------------------------------------------------------
                                   */
/* global google */

DrawingManager.propTypes = {
  /**
   * @type OverlayType
   */
  defaultDrawingMode: _propTypes2.default.any,

  /**
   * @type DrawingManagerOptions
   */
  defaultOptions: _propTypes2.default.any,

  /**
   * @type OverlayType
   */
  drawingMode: _propTypes2.default.any,

  /**
   * @type DrawingManagerOptions
   */
  options: _propTypes2.default.any,

  /**
   * function
   */
  onCircleComplete: _propTypes2.default.func,

  /**
   * function
   */
  onMarkerComplete: _propTypes2.default.func,

  /**
   * function
   */
  onOverlayComplete: _propTypes2.default.func,

  /**
   * function
   */
  onPolygonComplete: _propTypes2.default.func,

  /**
   * function
   */
  onPolylineComplete: _propTypes2.default.func,

  /**
   * function
   */
  onRectangleComplete: _propTypes2.default.func,
}
DrawingManager.contextTypes = (0, _defineProperty3.default)(
  {},
  _constants.MAP,
  _propTypes2.default.object
)
exports.default = DrawingManager

var eventMap = {
  onCircleComplete: "circlecomplete",
  onMarkerComplete: "markercomplete",
  onOverlayComplete: "overlaycomplete",
  onPolygonComplete: "polygoncomplete",
  onPolylineComplete: "polylinecomplete",
  onRectangleComplete: "rectanglecomplete",
}

var updaterMap = {
  drawingMode: function drawingMode(instance, _drawingMode) {
    instance.setDrawingMode(_drawingMode)
  },
  options: function options(instance, _options) {
    instance.setOptions(_options)
  },
}
