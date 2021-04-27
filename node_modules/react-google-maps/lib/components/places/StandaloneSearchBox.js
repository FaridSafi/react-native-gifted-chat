"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.StandaloneSearchBox = undefined

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
 * A wrapper around `google.maps.places.SearchBox` without the map
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
 */
/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
/* global google */
var SearchBox = (function(_React$PureComponent) {
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
      key: "componentDidMount",
      value: function componentDidMount() {
        ;(0, _invariant2.default)(
          google.maps.places,
          'Did you include "libraries=places" in the URL?'
        )
        var element = _reactDom2.default.findDOMNode(this)
        /*
       * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
       */
        var searchBox = new google.maps.places.SearchBox(
          element.querySelector("input") || element
        )
        ;(0, _MapChildHelper.construct)(
          SearchBox.propTypes,
          updaterMap,
          this.props,
          searchBox
        )

        ;(0, _MapChildHelper.componentDidMount)(this, searchBox, eventMap)
        this.setState(
          (0, _defineProperty3.default)({}, _constants.SEARCH_BOX, searchBox)
        )
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
      },
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        ;(0, _MapChildHelper.componentWillUnmount)(this)
      },
    },
    {
      key: "render",
      value: function render() {
        return _react2.default.Children.only(this.props.children)
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
})(_react2.default.PureComponent)

SearchBox.displayName = "StandaloneSearchBox"
SearchBox.propTypes = {
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
var StandaloneSearchBox = (exports.StandaloneSearchBox = SearchBox)

exports.default = StandaloneSearchBox

var eventMap = {
  onPlacesChanged: "places_changed",
}

var updaterMap = {
  bounds: function bounds(instance, _bounds) {
    instance.setBounds(_bounds)
  },
}
