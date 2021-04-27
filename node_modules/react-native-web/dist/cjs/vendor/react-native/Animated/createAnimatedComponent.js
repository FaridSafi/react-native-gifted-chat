/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _AnimatedEvent = require("./AnimatedEvent");

var _AnimatedProps = _interopRequireDefault(require("./nodes/AnimatedProps"));

var _react = _interopRequireDefault(require("react"));

var _ViewStylePropTypes = _interopRequireDefault(require("../../../exports/View/ViewStylePropTypes"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function createAnimatedComponent(Component) {
  (0, _invariant.default)(typeof Component === 'string' || Component.prototype && Component.prototype.isReactComponent, '`createAnimatedComponent` does not support stateless functional components; ' + 'use a class component instead.');

  var AnimatedComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(AnimatedComponent, _React$Component);

    function AnimatedComponent(props) {
      var _this;

      _this = _React$Component.call(this, props) || this;
      _this._invokeAnimatedPropsCallbackOnMount = false;
      _this._eventDetachers = [];

      _this._animatedPropsCallback = function () {
        if (_this._component == null) {
          // AnimatedProps is created in will-mount because it's used in render.
          // But this callback may be invoked before mount in async mode,
          // In which case we should defer the setNativeProps() call.
          // React may throw away uncommitted work in async mode,
          // So a deferred call won't always be invoked.
          _this._invokeAnimatedPropsCallbackOnMount = true;
        } else if (AnimatedComponent.__skipSetNativeProps_FOR_TESTS_ONLY || typeof _this._component.setNativeProps !== 'function') {
          _this.forceUpdate();
        } else if (!_this._propsAnimated.__isNative) {
          _this._component.setNativeProps(_this._propsAnimated.__getAnimatedValue());
        } else {
          throw new Error('Attempting to run JS driven animation on animated ' + 'node that has been moved to "native" earlier by starting an ' + 'animation with `useNativeDriver: true`');
        }
      };

      _this._setComponentRef = _this._setComponentRef.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    var _proto = AnimatedComponent.prototype;

    _proto.componentWillUnmount = function componentWillUnmount() {
      this._propsAnimated && this._propsAnimated.__detach();

      this._detachNativeEvents();
    };

    _proto.setNativeProps = function setNativeProps(props) {
      this._component.setNativeProps(props);
    };

    _proto.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
      this._attachProps(this.props);
    };

    _proto.componentDidMount = function componentDidMount() {
      if (this._invokeAnimatedPropsCallbackOnMount) {
        this._invokeAnimatedPropsCallbackOnMount = false;

        this._animatedPropsCallback();
      }

      this._propsAnimated.setNativeView(this._component);

      this._attachNativeEvents();
    };

    _proto._attachNativeEvents = function _attachNativeEvents() {
      var _this2 = this;

      // Make sure to get the scrollable node for components that implement
      // `ScrollResponder.Mixin`.
      var scrollableNode = this._component.getScrollableNode ? this._component.getScrollableNode() : this._component;

      var _loop = function _loop(key) {
        var prop = _this2.props[key];

        if (prop instanceof _AnimatedEvent.AnimatedEvent && prop.__isNative) {
          prop.__attach(scrollableNode, key);

          _this2._eventDetachers.push(function () {
            return prop.__detach(scrollableNode, key);
          });
        }
      };

      for (var key in this.props) {
        _loop(key);
      }
    };

    _proto._detachNativeEvents = function _detachNativeEvents() {
      this._eventDetachers.forEach(function (remove) {
        return remove();
      });

      this._eventDetachers = [];
    } // The system is best designed when setNativeProps is implemented. It is
    // able to avoid re-rendering and directly set the attributes that changed.
    // However, setNativeProps can only be implemented on leaf native
    // components. If you want to animate a composite component, you need to
    // re-render it. In this case, we have a fallback that uses forceUpdate.
    ;

    _proto._attachProps = function _attachProps(nextProps) {
      var oldPropsAnimated = this._propsAnimated;
      this._propsAnimated = new _AnimatedProps.default(nextProps, this._animatedPropsCallback); // When you call detach, it removes the element from the parent list
      // of children. If it goes to 0, then the parent also detaches itself
      // and so on.
      // An optimization is to attach the new elements and THEN detach the old
      // ones instead of detaching and THEN attaching.
      // This way the intermediate state isn't to go to 0 and trigger
      // this expensive recursive detaching to then re-attach everything on
      // the very next operation.

      oldPropsAnimated && oldPropsAnimated.__detach();
    };

    _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(newProps) {
      this._attachProps(newProps);
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      if (this._component !== this._prevComponent) {
        this._propsAnimated.setNativeView(this._component);
      }

      if (this._component !== this._prevComponent || prevProps !== this.props) {
        this._detachNativeEvents();

        this._attachNativeEvents();
      }
    };

    _proto.render = function render() {
      var props = this._propsAnimated.__getValue();

      return _react.default.createElement(Component, _extends({}, props, {
        ref: this._setComponentRef // The native driver updates views directly through the UI thread so we
        // have to make sure the view doesn't get optimized away because it cannot
        // go through the NativeViewHierarchyManager since it operates on the shadow
        // thread.
        ,
        collapsable: this._propsAnimated.__isNative ? false : props.collapsable
      }));
    };

    _proto._setComponentRef = function _setComponentRef(c) {
      this._prevComponent = this._component;
      this._component = c;
    } // A third party library can use getNode()
    // to get the node reference of the decorated component
    ;

    _proto.getNode = function getNode() {
      return this._component;
    };

    return AnimatedComponent;
  }(_react.default.Component);

  AnimatedComponent.__skipSetNativeProps_FOR_TESTS_ONLY = false;
  var propTypes = Component.propTypes;
  AnimatedComponent.propTypes = process.env.NODE_ENV !== "production" ? {
    style: function style(props, propName, componentName) {
      if (!propTypes) {
        return;
      }

      for (var key in _ViewStylePropTypes.default) {
        if (!propTypes[key] && props[key] !== undefined) {
          console.warn('You are setting the style `{ ' + key + ': ... }` as a prop. You ' + 'should nest it in a style object. ' + 'E.g. `{ style: { ' + key + ': ... } }`');
        }
      }
    }
  } : {};
  return AnimatedComponent;
}

var _default = createAnimatedComponent;
exports.default = _default;
module.exports = exports.default;