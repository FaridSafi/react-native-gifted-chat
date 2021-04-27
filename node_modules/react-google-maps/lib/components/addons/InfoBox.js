"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.InfoBox = undefined

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

var _InfoBox$contextTypes

var _canUseDom = require("can-use-dom")

var _canUseDom2 = _interopRequireDefault(_canUseDom)

var _invariant = require("invariant")

var _invariant2 = _interopRequireDefault(_invariant)

var _react = require("react")

var _react2 = _interopRequireDefault(_react)

var _reactDom = require("react-dom")

var _reactDom2 = _interopRequireDefault(_reactDom)

var _propTypes = require("prop-types")

var _propTypes2 = _interopRequireDefault(_propTypes)

var _MapChildHelper = require("../../utils/MapChildHelper")

var _constants = require("../../constants")

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/**
 * A wrapper around `InfoBox`
 *
 * @see http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/infobox/docs/reference.html
 */
var InfoBox = (exports.InfoBox = (function(_React$PureComponent) {
  ;(0, _inherits3.default)(InfoBox, _React$PureComponent)

  function InfoBox() {
    var _ref

    var _temp, _this, _ret

    ;(0, _classCallCheck3.default)(this, InfoBox)

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    return (
      (_ret = ((_temp = ((_this = (0, _possibleConstructorReturn3.default)(
        this,
        (_ref =
          InfoBox.__proto__ ||
          (0, _getPrototypeOf2.default)(InfoBox)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this)),
      (_this.state = (0, _defineProperty3.default)(
        {},
        _constants.INFO_BOX,
        null
      )),
      _temp)),
      (0, _possibleConstructorReturn3.default)(_this, _ret)
    )
  }

  ;(0, _createClass3.default)(InfoBox, [
    {
      key: "componentWillMount",

      /*
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoBox
     */
      value: function componentWillMount() {
        if (!_canUseDom2.default || this.state[_constants.INFO_BOX]) {
          return
        }

        var _require = require(/* "google-maps-infobox" uses "google" as a global variable. Since we don't
                              * have "google" on the server, we can not use it in server-side rendering.
                              * As a result, we import "google-maps-infobox" here to prevent an error on
                              * a isomorphic server.
                              */ "google-maps-infobox"),
          GoogleMapsInfobox = _require.InfoBox

        var infoBox = new GoogleMapsInfobox()
        ;(0, _MapChildHelper.construct)(
          InfoBox.propTypes,
          updaterMap,
          this.props,
          infoBox
        )
        infoBox.setMap(this.context[_constants.MAP])
        this.setState(
          (0, _defineProperty3.default)({}, _constants.INFO_BOX, infoBox)
        )
      },
    },
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        ;(0, _MapChildHelper.componentDidMount)(
          this,
          this.state[_constants.INFO_BOX],
          eventMap
        )
        var content = document.createElement("div")
        _reactDom2.default.unstable_renderSubtreeIntoContainer(
          this,
          _react2.default.Children.only(this.props.children),
          content
        )
        this.state[_constants.INFO_BOX].setContent(content)
        open(this.state[_constants.INFO_BOX], this.context[_constants.ANCHOR])
      },
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        ;(0, _MapChildHelper.componentDidUpdate)(
          this,
          this.state[_constants.INFO_BOX],
          eventMap,
          updaterMap,
          prevProps
        )
        if (this.props.children !== prevProps.children) {
          _reactDom2.default.unstable_renderSubtreeIntoContainer(
            this,
            _react2.default.Children.only(this.props.children),
            this.state[_constants.INFO_BOX].getContent()
          )
        }
      },
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        ;(0, _MapChildHelper.componentWillUnmount)(this)
        var infoBox = this.state[_constants.INFO_BOX]
        if (infoBox) {
          if (infoBox.getContent()) {
            _reactDom2.default.unmountComponentAtNode(infoBox.getContent())
          }
          infoBox.setMap(null)
        }
      },
    },
    {
      key: "render",
      value: function render() {
        return false
      },

      /**
       *
       * @type LatLng
       */
    },
    {
      key: "getPosition",
      value: function getPosition() {
        return this.state[_constants.INFO_BOX].getPosition()
      },

      /**
       *
       * @type boolean
       */
    },
    {
      key: "getVisible",
      value: function getVisible() {
        return this.state[_constants.INFO_BOX].getVisible()
      },

      /**
       *
       * @type number
       */
    },
    {
      key: "getZIndex",
      value: function getZIndex() {
        return this.state[_constants.INFO_BOX].getZIndex()
      },
    },
  ])
  return InfoBox
})(_react2.default.PureComponent))

InfoBox.propTypes = {
  /**
   * @type InfoBoxOptions
   */
  defaultOptions: _propTypes2.default.any,

  /**
   * @type LatLng|LatLngLiteral
   */
  defaultPosition: _propTypes2.default.any,

  /**
   * @type boolean
   */
  defaultVisible: _propTypes2.default.bool,

  /**
   * @type number
   */
  defaultZIndex: _propTypes2.default.number,

  /**
   * @type InfoBoxOptions
   */
  options: _propTypes2.default.any,

  /**
   * @type LatLng|LatLngLiteral
   */
  position: _propTypes2.default.any,

  /**
   * @type boolean
   */
  visible: _propTypes2.default.bool,

  /**
   * @type number
   */
  zIndex: _propTypes2.default.number,

  /**
   * function
   */
  onCloseClick: _propTypes2.default.func,

  /**
   * function
   */
  onDomReady: _propTypes2.default.func,

  /**
   * function
   */
  onContentChanged: _propTypes2.default.func,

  /**
   * function
   */
  onPositionChanged: _propTypes2.default.func,

  /**
   * function
   */
  onZindexChanged: _propTypes2.default.func,
}
InfoBox.contextTypes = ((_InfoBox$contextTypes = {}),
(0, _defineProperty3.default)(
  _InfoBox$contextTypes,
  _constants.MAP,
  _propTypes2.default.object
),
(0, _defineProperty3.default)(
  _InfoBox$contextTypes,
  _constants.ANCHOR,
  _propTypes2.default.object
),
_InfoBox$contextTypes)
exports.default = InfoBox

var open = function open(infoBox, anchor) {
  if (anchor) {
    infoBox.open(infoBox.getMap(), anchor)
  } else if (infoBox.getPosition()) {
    infoBox.open(infoBox.getMap())
  } else {
    ;(0, _invariant2.default)(
      false,
      "You must provide either an anchor (typically render it inside a <Marker>) or a position props for <InfoBox>."
    )
  }
}

var eventMap = {
  onCloseClick: "closeclick",
  onDomReady: "domready",
  onContentChanged: "content_changed",
  onPositionChanged: "position_changed",
  onZindexChanged: "zindex_changed",
}

var updaterMap = {
  options: function options(instance, _options) {
    instance.setOptions(_options)
  },
  position: function position(instance, _position) {
    instance.setPosition(_position)
  },
  visible: function visible(instance, _visible) {
    instance.setVisible(_visible)
  },
  zIndex: function zIndex(instance, _zIndex) {
    instance.setZIndex(_zIndex)
  },
}
