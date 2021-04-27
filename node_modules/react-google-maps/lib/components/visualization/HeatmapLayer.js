"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.HeatmapLayer = undefined

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
 * A wrapper around `google.maps.visualization.HeatmapLayer`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#HeatmapLayer
 */
var HeatmapLayer = (exports.HeatmapLayer = (function(_React$PureComponent) {
  ;(0, _inherits3.default)(HeatmapLayer, _React$PureComponent)

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#HeatmapLayer
   */
  function HeatmapLayer(props, context) {
    ;(0, _classCallCheck3.default)(this, HeatmapLayer)

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (
        HeatmapLayer.__proto__ || (0, _getPrototypeOf2.default)(HeatmapLayer)
      ).call(this, props, context)
    )

    ;(0, _invariant2.default)(
      google.maps.visualization,
      'Did you include "libraries=visualization" in the URL?'
    )
    var heatmapLayer = new google.maps.visualization.HeatmapLayer()
    ;(0, _MapChildHelper.construct)(
      HeatmapLayer.propTypes,
      updaterMap,
      _this.props,
      heatmapLayer
    )
    heatmapLayer.setMap(_this.context[_constants.MAP])
    _this.state = (0, _defineProperty3.default)(
      {},
      _constants.HEATMAP_LAYER,
      heatmapLayer
    )
    return _this
  }

  ;(0, _createClass3.default)(HeatmapLayer, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        ;(0, _MapChildHelper.componentDidMount)(
          this,
          this.state[_constants.HEATMAP_LAYER],
          eventMap
        )
      },
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        ;(0, _MapChildHelper.componentDidUpdate)(
          this,
          this.state[_constants.HEATMAP_LAYER],
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
        var heatmapLayer = this.state[_constants.HEATMAP_LAYER]
        if (heatmapLayer) {
          heatmapLayer.setMap(null)
        }
      },
    },
    {
      key: "render",
      value: function render() {
        return false
      },

      /**
       * Returns the data points currently displayed by this heatmap.
       * @type MVCArray<LatLng|WeightedLocation>
       * @public
       */
    },
    {
      key: "getData",
      value: function getData() {
        return this.state[_constants.HEATMAP_LAYER].getData()
      },
    },
  ])
  return HeatmapLayer
})(
  _react2.default.PureComponent
)) /*
                                   * -----------------------------------------------------------------------------
                                   * This file is auto-generated from the corresponding file at `src/macros/`.
                                   * Please **DO NOT** edit this file directly when creating PRs.
                                   * -----------------------------------------------------------------------------
                                   */
/* global google */

HeatmapLayer.propTypes = {
  /**
   * @type MVCArray<LatLng|WeightedLocation>|Array<LatLng|WeightedLocation>
   */
  defaultData: _propTypes2.default.any,

  /**
   * @type HeatmapLayerOptions
   */
  defaultOptions: _propTypes2.default.any,

  /**
   * @type MVCArray<LatLng|WeightedLocation>|Array<LatLng|WeightedLocation>
   */
  data: _propTypes2.default.any,

  /**
   * @type HeatmapLayerOptions
   */
  options: _propTypes2.default.any,
}
HeatmapLayer.contextTypes = (0, _defineProperty3.default)(
  {},
  _constants.MAP,
  _propTypes2.default.object
)
exports.default = HeatmapLayer

var eventMap = {}

var updaterMap = {
  data: function data(instance, _data) {
    instance.setData(_data)
  },
  options: function options(instance, _options) {
    instance.setOptions(_options)
  },
}
