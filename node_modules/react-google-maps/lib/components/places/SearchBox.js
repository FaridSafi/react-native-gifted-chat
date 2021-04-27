"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.SearchBox = undefined

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

var _isNumber2 = require("lodash/isNumber")

var _isNumber3 = _interopRequireDefault(_isNumber2)

var _invariant = require("invariant")

var _invariant2 = _interopRequireDefault(_invariant)

var _canUseDom = require("can-use-dom")

var _canUseDom2 = _interopRequireDefault(_canUseDom)

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
 * A wrapper around `google.maps.places.SearchBox` on the map
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
 */
var SearchBox = (exports.SearchBox = (function(_React$PureComponent) {
  ;(0, _inherits3.default)(SearchBox, _React$PureComponent)

  function SearchBox() {
    var _ref

    var _temp, _this, _ret

    ;(0, _classCallCheck3.default)(this, SearchBox)

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
          SearchBox.__proto__ ||
          (0, _getPrototypeOf2.default)(SearchBox)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this)),
      (_this.state = (0, _defineProperty3.default)(
        {},
        _constants.SEARCH_BOX,
        null
      )),
      _temp)),
      (0, _possibleConstructorReturn3.default)(_this, _ret)
    )
  }

  ;(0, _createClass3.default)(SearchBox, [
    {
      key: "componentWillMount",
      value: function componentWillMount() {
        if (!_canUseDom2.default || this.containerElement) {
          return
        }
        ;(0, _invariant2.default)(
          google.maps.places,
          'Did you include "libraries=places" in the URL?'
        )
        this.containerElement = document.createElement("div")
        this.handleRenderChildToContainerElement()
        if (_react2.default.version.match(/^16/)) {
          return
        }
        this.handleInitializeSearchBox()
      },
    },
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        var searchBox = this.state[_constants.SEARCH_BOX]
        if (_react2.default.version.match(/^16/)) {
          searchBox = this.handleInitializeSearchBox()
        }
        ;(0, _MapChildHelper.componentDidMount)(this, searchBox, eventMap)
        this.handleMountAtControlPosition()
      },
    },
    {
      key: "componentWillUpdate",
      value: function componentWillUpdate(nextProp) {
        if (this.props.controlPosition !== nextProp.controlPosition) {
          this.handleUnmountAtControlPosition()
        }
      },
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        ;(0, _MapChildHelper.componentDidUpdate)(
          this,
          this.state[_constants.SEARCH_BOX],
          eventMap,
          updaterMap,
          prevProps
        )
        if (this.props.children !== prevProps.children) {
          this.handleRenderChildToContainerElement()
        }
        if (this.props.controlPosition !== prevProps.controlPosition) {
          this.handleMountAtControlPosition()
        }
      },
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        ;(0, _MapChildHelper.componentWillUnmount)(this)
        this.handleUnmountAtControlPosition()
        if (_react2.default.version.match(/^16/)) {
          return
        }
        if (this.containerElement) {
          _reactDom2.default.unmountComponentAtNode(this.containerElement)
          this.containerElement = null
        }
      },
    },
    {
      key: "handleInitializeSearchBox",
      value: function handleInitializeSearchBox() {
        /*
       * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
       */
        var searchBox = new google.maps.places.SearchBox(
          this.containerElement.querySelector("input")
        )
        ;(0, _MapChildHelper.construct)(
          SearchBox.propTypes,
          updaterMap,
          this.props,
          searchBox
        )
        this.setState(
          (0, _defineProperty3.default)({}, _constants.SEARCH_BOX, searchBox)
        )
        return searchBox
      },
    },
    {
      key: "handleRenderChildToContainerElement",
      value: function handleRenderChildToContainerElement() {
        if (_react2.default.version.match(/^16/)) {
          return
        }
        _reactDom2.default.unstable_renderSubtreeIntoContainer(
          this,
          _react2.default.Children.only(this.props.children),
          this.containerElement
        )
      },
    },
    {
      key: "handleMountAtControlPosition",
      value: function handleMountAtControlPosition() {
        if (isValidControlPosition(this.props.controlPosition)) {
          this.mountControlIndex =
            -1 +
            this.context[_constants.MAP].controls[
              this.props.controlPosition
            ].push(this.containerElement.firstChild)
        }
      },
    },
    {
      key: "handleUnmountAtControlPosition",
      value: function handleUnmountAtControlPosition() {
        if (isValidControlPosition(this.props.controlPosition)) {
          var child = this.context[_constants.MAP].controls[
            this.props.controlPosition
          ].removeAt(this.mountControlIndex)
          if (child !== undefined) {
            this.containerElement.appendChild(child)
          }
        }
      },
    },
    {
      key: "render",
      value: function render() {
        if (_react2.default.version.match(/^16/)) {
          return _reactDom2.default.createPortal(
            _react2.default.Children.only(this.props.children),
            this.containerElement
          )
        }
        return false
      },

      /**
       * Returns the bounds to which query predictions are biased.
       * @type LatLngBounds
       * @public
       */
    },
    {
      key: "getBounds",
      value: function getBounds() {
        return this.state[_constants.SEARCH_BOX].getBounds()
      },

      /**
       * Returns the query selected by the user, or `null` if no places have been found yet, to be used with `places_changed` event.
       * @type Array<PlaceResult>nullplaces_changed
       * @public
       */
    },
    {
      key: "getPlaces",
      value: function getPlaces() {
        return this.state[_constants.SEARCH_BOX].getPlaces()
      },
    },
  ])
  return SearchBox
})(
  _react2.default.PureComponent
)) /*
                                   * -----------------------------------------------------------------------------
                                   * This file is auto-generated from the corresponding file at `src/macros/`.
                                   * Please **DO NOT** edit this file directly when creating PRs.
                                   * -----------------------------------------------------------------------------
                                   */
/* global google */

SearchBox.propTypes = {
  /**
   * Where to put `<SearchBox>` inside a `<GoogleMap>`
   *
   * @example google.maps.ControlPosition.TOP_LEFT
   * @type number
   */
  controlPosition: _propTypes2.default.number,

  /**
   * @type LatLngBounds|LatLngBoundsLiteral
   */
  defaultBounds: _propTypes2.default.any,

  /**
   * @type LatLngBounds|LatLngBoundsLiteral
   */
  bounds: _propTypes2.default.any,

  /**
   * function
   */
  onPlacesChanged: _propTypes2.default.func,
}
SearchBox.contextTypes = (0, _defineProperty3.default)(
  {},
  _constants.MAP,
  _propTypes2.default.object
)
exports.default = SearchBox

var isValidControlPosition = _isNumber3.default

var eventMap = {
  onPlacesChanged: "places_changed",
}

var updaterMap = {
  bounds: function bounds(instance, _bounds) {
    instance.setBounds(_bounds)
  },
}
