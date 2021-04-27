"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.MarkerClusterer = undefined

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

var _MarkerClusterer$chil

var _react = require("react")

var _react2 = _interopRequireDefault(_react)

var _propTypes = require("prop-types")

var _propTypes2 = _interopRequireDefault(_propTypes)

var _markerClustererPlus = require("marker-clusterer-plus")

var _markerClustererPlus2 = _interopRequireDefault(_markerClustererPlus)

var _MapChildHelper = require("../../utils/MapChildHelper")

var _constants = require("../../constants")

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/**
 * A wrapper around `MarkerClusterer`
 *
 * @see https://github.com/mahnunchik/markerclustererplus/blob/master/docs/reference.html
 */
var MarkerClusterer = (exports.MarkerClusterer = (function(
  _React$PureComponent
) {
  ;(0, _inherits3.default)(MarkerClusterer, _React$PureComponent)

  /*
   * @see https://github.com/mahnunchik/markerclustererplus/blob/master/docs/reference.html
   */
  function MarkerClusterer(props, context) {
    ;(0, _classCallCheck3.default)(this, MarkerClusterer)

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (
        MarkerClusterer.__proto__ ||
        (0, _getPrototypeOf2.default)(MarkerClusterer)
      ).call(this, props, context)
    )

    var markerClusterer = new _markerClustererPlus2.default()
    ;(0, _MapChildHelper.construct)(
      MarkerClusterer.propTypes,
      updaterMap,
      _this.props,
      markerClusterer
    )
    markerClusterer.setMap(_this.context[_constants.MAP])
    _this.state = (0, _defineProperty3.default)(
      {},
      _constants.MARKER_CLUSTERER,
      markerClusterer
    )
    return _this
  }

  ;(0, _createClass3.default)(MarkerClusterer, [
    {
      key: "getChildContext",
      value: function getChildContext() {
        var _ref

        var markerClusterer = this.state[_constants.MARKER_CLUSTERER]
        return (
          (_ref = {}),
          (0, _defineProperty3.default)(
            _ref,
            _constants.ANCHOR,
            markerClusterer
          ),
          (0, _defineProperty3.default)(
            _ref,
            _constants.MARKER_CLUSTERER,
            markerClusterer
          ),
          _ref
        )
      },
    },
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        ;(0, _MapChildHelper.componentDidMount)(
          this,
          this.state[_constants.MARKER_CLUSTERER],
          eventMap
        )
      },
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        ;(0, _MapChildHelper.componentDidUpdate)(
          this,
          this.state[_constants.MARKER_CLUSTERER],
          eventMap,
          updaterMap,
          prevProps
        )
        this.state[_constants.MARKER_CLUSTERER].repaint()
      },
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        ;(0, _MapChildHelper.componentWillUnmount)(this)
        var markerClusterer = this.state[_constants.MARKER_CLUSTERER]
        if (markerClusterer) {
          markerClusterer.setMap(null)
        }
      },
    },
    {
      key: "render",
      value: function render() {
        var children = this.props.children

        return _react2.default.createElement("div", null, children)
      },
    },
  ])
  return MarkerClusterer
})(_react2.default.PureComponent))

MarkerClusterer.propTypes = {
  /**
   * @type boolean
   */
  defaultAverageCenter: _propTypes2.default.bool,

  /**
   * @type number
   */
  defaultBatchSizeIE: _propTypes2.default.number,

  /**
   * @type number
   */
  defaultBatchSize: _propTypes2.default.number,

  /**
   * @type function
   */
  defaultCalculator: _propTypes2.default.func,

  /**
   * @type string
   */
  defaultClusterClass: _propTypes2.default.string,

  /**
   * @type boolean
   */
  defaultEnableRetinaIcons: _propTypes2.default.bool,

  /**
   * @type number
   */
  defaultGridSize: _propTypes2.default.number,

  /**
   * @type boolean
   */
  defaultIgnoreHidden: _propTypes2.default.bool,

  /**
   * @type string
   */
  defaultImageExtension: _propTypes2.default.string,

  /**
   * @type string
   */
  defaultImagePath: _propTypes2.default.string,

  /**
   * @type Array
   */
  defaultImageSizes: _propTypes2.default.array,

  /**
   * @type number
   */
  defaultMaxZoom: _propTypes2.default.number,

  /**
   * @type number
   */
  defaultMinimumClusterSize: _propTypes2.default.number,

  /**
   * @type Array
   */
  defaultStyles: _propTypes2.default.array,

  /**
   * @type string
   */
  defaultTitle: _propTypes2.default.string,

  /**
   * @type boolean
   */
  defaultZoomOnClick: _propTypes2.default.bool,

  /**
   * @type boolean
   */
  averageCenter: _propTypes2.default.bool,

  /**
   * @type number
   */
  batchSizeIE: _propTypes2.default.number,

  /**
   * @type number
   */
  batchSize: _propTypes2.default.number,

  /**
   * @type function
   */
  calculator: _propTypes2.default.func,

  /**
   * @type string
   */
  clusterClass: _propTypes2.default.string,

  /**
   * @type boolean
   */
  enableRetinaIcons: _propTypes2.default.bool,

  /**
   * @type number
   */
  gridSize: _propTypes2.default.number,

  /**
   * @type boolean
   */
  ignoreHidden: _propTypes2.default.bool,

  /**
   * @type string
   */
  imageExtension: _propTypes2.default.string,

  /**
   * @type string
   */
  imagePath: _propTypes2.default.string,

  /**
   * @type Array
   */
  imageSizes: _propTypes2.default.array,

  /**
   * @type number
   */
  maxZoom: _propTypes2.default.number,

  /**
   * @type number
   */
  minimumClusterSize: _propTypes2.default.number,

  /**
   * @type Array
   */
  styles: _propTypes2.default.array,

  /**
   * @type string
   */
  title: _propTypes2.default.string,

  /**
   * @type boolean
   */
  zoomOnClick: _propTypes2.default.bool,

  /**
   * function
   */
  onClick: _propTypes2.default.func,

  /**
   * function
   */
  onClusteringBegin: _propTypes2.default.func,

  /**
   * function
   */
  onClusteringEnd: _propTypes2.default.func,

  /**
   * function
   */
  onMouseOut: _propTypes2.default.func,

  /**
   * function
   */
  onMouseOver: _propTypes2.default.func,
}
MarkerClusterer.contextTypes = (0, _defineProperty3.default)(
  {},
  _constants.MAP,
  _propTypes2.default.object
)
MarkerClusterer.childContextTypes = ((_MarkerClusterer$chil = {}),
(0, _defineProperty3.default)(
  _MarkerClusterer$chil,
  _constants.ANCHOR,
  _propTypes2.default.object
),
(0, _defineProperty3.default)(
  _MarkerClusterer$chil,
  _constants.MARKER_CLUSTERER,
  _propTypes2.default.object
),
_MarkerClusterer$chil)
exports.default = MarkerClusterer

var eventMap = {
  onClick: "click",
  onClusteringBegin: "clusteringbegin",
  onClusteringEnd: "clusteringend",
  onMouseOut: "mouseout",
  onMouseOver: "mouseover",
}

var updaterMap = {
  averageCenter: function averageCenter(instance, _averageCenter) {
    instance.setAverageCenter(_averageCenter)
  },
  batchSizeIE: function batchSizeIE(instance, _batchSizeIE) {
    instance.setBatchSizeIE(_batchSizeIE)
  },
  batchSize: function batchSize(instance, _batchSize) {
    instance.setBatchSize(_batchSize)
  },
  calculator: function calculator(instance, _calculator) {
    instance.setCalculator(_calculator)
  },
  clusterClass: function clusterClass(instance, _clusterClass) {
    instance.setClusterClass(_clusterClass)
  },
  enableRetinaIcons: function enableRetinaIcons(instance, _enableRetinaIcons) {
    instance.setEnableRetinaIcons(_enableRetinaIcons)
  },
  gridSize: function gridSize(instance, _gridSize) {
    instance.setGridSize(_gridSize)
  },
  ignoreHidden: function ignoreHidden(instance, _ignoreHidden) {
    instance.setIgnoreHidden(_ignoreHidden)
  },
  imageExtension: function imageExtension(instance, _imageExtension) {
    instance.setImageExtension(_imageExtension)
  },
  imagePath: function imagePath(instance, _imagePath) {
    instance.setImagePath(_imagePath)
  },
  imageSizes: function imageSizes(instance, _imageSizes) {
    instance.setImageSizes(_imageSizes)
  },
  maxZoom: function maxZoom(instance, _maxZoom) {
    instance.setMaxZoom(_maxZoom)
  },
  minimumClusterSize: function minimumClusterSize(
    instance,
    _minimumClusterSize
  ) {
    instance.setMinimumClusterSize(_minimumClusterSize)
  },
  styles: function styles(instance, _styles) {
    instance.setStyles(_styles)
  },
  title: function title(instance, _title) {
    instance.setTitle(_title)
  },
  zoomOnClick: function zoomOnClick(instance, _zoomOnClick) {
    instance.setZoomOnClick(_zoomOnClick)
  },
}
