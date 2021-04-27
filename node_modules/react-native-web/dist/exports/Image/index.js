function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import applyNativeMethods from '../../modules/applyNativeMethods';
import createElement from '../createElement';
import css from '../StyleSheet/css';
import { getAssetByID } from '../../modules/AssetRegistry';
import resolveShadowValue from '../StyleSheet/resolveShadowValue';
import ImageLoader from '../../modules/ImageLoader';
import ImageResizeMode from './ImageResizeMode';
import ImageSourcePropType from './ImageSourcePropType';
import ImageStylePropTypes from './ImageStylePropTypes';
import ImageUriCache from './ImageUriCache';
import StyleSheet from '../StyleSheet';
import StyleSheetPropType from '../../modules/StyleSheetPropType';
import View from '../View';
import ViewPropTypes from '../ViewPropTypes';
import { bool, func, number, oneOf, shape } from 'prop-types';
import React, { Component } from 'react';
var emptyObject = {};
var STATUS_ERRORED = 'ERRORED';
var STATUS_LOADED = 'LOADED';
var STATUS_LOADING = 'LOADING';
var STATUS_PENDING = 'PENDING';
var STATUS_IDLE = 'IDLE';

var getImageState = function getImageState(uri, shouldDisplaySource) {
  return shouldDisplaySource ? STATUS_LOADED : uri ? STATUS_PENDING : STATUS_IDLE;
};

var resolveAssetDimensions = function resolveAssetDimensions(source) {
  if (typeof source === 'number') {
    var _getAssetByID = getAssetByID(source),
        height = _getAssetByID.height,
        width = _getAssetByID.width;

    return {
      height: height,
      width: width
    };
  } else if (typeof source === 'object') {
    var _height = source.height,
        _width = source.width;
    return {
      height: _height,
      width: _width
    };
  }
};

var svgDataUriPattern = /^(data:image\/svg\+xml;utf8,)(.*)/;

var resolveAssetUri = function resolveAssetUri(source) {
  var uri = '';

  if (typeof source === 'number') {
    // get the URI from the packager
    var asset = getAssetByID(source);
    var scale = asset.scales[0];
    var scaleSuffix = scale !== 1 ? "@" + scale + "x" : '';
    uri = asset ? asset.httpServerLocation + "/" + asset.name + scaleSuffix + "." + asset.type : '';
  } else if (typeof source === 'string') {
    uri = source;
  } else if (source && typeof source.uri === 'string') {
    uri = source.uri;
  }

  if (uri) {
    var match = uri.match(svgDataUriPattern); // inline SVG markup may contain characters (e.g., #, ") that need to be escaped

    if (match) {
      var prefix = match[1],
          svg = match[2];
      var encodedSvg = encodeURIComponent(svg);
      return "" + prefix + encodedSvg;
    }
  }

  return uri;
};

var filterId = 0;

var createTintColorSVG = function createTintColorSVG(tintColor, id) {
  return tintColor && id != null ? React.createElement("svg", {
    style: {
      position: 'absolute',
      height: 0,
      visibility: 'hidden',
      width: 0
    }
  }, React.createElement("defs", null, React.createElement("filter", {
    id: "tint-" + id
  }, React.createElement("feFlood", {
    floodColor: "" + tintColor
  }), React.createElement("feComposite", {
    in2: "SourceAlpha",
    operator: "atop"
  })))) : null;
};

var Image =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Image, _Component);

  Image.getSize = function getSize(uri, success, failure) {
    ImageLoader.getSize(uri, success, failure);
  };

  Image.prefetch = function prefetch(uri) {
    return ImageLoader.prefetch(uri).then(function () {
      // Add the uri to the cache so it can be immediately displayed when used
      // but also immediately remove it to correctly reflect that it has no active references
      ImageUriCache.add(uri);
      ImageUriCache.remove(uri);
    });
  };

  Image.queryCache = function queryCache(uris) {
    var result = {};
    uris.forEach(function (u) {
      if (ImageUriCache.has(u)) {
        result[u] = 'disk/memory';
      }
    });
    return Promise.resolve(result);
  };

  function Image(props, context) {
    var _this;

    _this = _Component.call(this, props, context) || this; // If an image has been loaded before, render it immediately

    _this._filterId = 0;
    _this._imageRef = null;
    _this._imageRequestId = null;
    _this._imageState = null;
    _this._isMounted = false;

    _this._createLayoutHandler = function (resizeMode) {
      var onLayout = _this.props.onLayout;

      if (resizeMode === 'center' || resizeMode === 'repeat' || onLayout) {
        return function (e) {
          var layout = e.nativeEvent.layout;
          onLayout && onLayout(e);

          _this.setState(function () {
            return {
              layout: layout
            };
          });
        };
      }
    };

    _this._getBackgroundSize = function (resizeMode) {
      if (_this._imageRef && (resizeMode === 'center' || resizeMode === 'repeat')) {
        var _this$_imageRef = _this._imageRef,
            naturalHeight = _this$_imageRef.naturalHeight,
            naturalWidth = _this$_imageRef.naturalWidth;
        var _this$state$layout = _this.state.layout,
            height = _this$state$layout.height,
            width = _this$state$layout.width;

        if (naturalHeight && naturalWidth && height && width) {
          var scaleFactor = Math.min(1, width / naturalWidth, height / naturalHeight);
          var x = Math.ceil(scaleFactor * naturalWidth);
          var y = Math.ceil(scaleFactor * naturalHeight);
          return {
            backgroundSize: x + "px " + y + "px"
          };
        }
      }
    };

    _this._onError = function () {
      var _this$props = _this.props,
          onError = _this$props.onError,
          source = _this$props.source;

      _this._updateImageState(STATUS_ERRORED);

      if (onError) {
        onError({
          nativeEvent: {
            error: "Failed to load resource " + resolveAssetUri(source) + " (404)"
          }
        });
      }

      _this._onLoadEnd();
    };

    _this._onLoad = function (e) {
      var _this$props2 = _this.props,
          onLoad = _this$props2.onLoad,
          source = _this$props2.source;
      var event = {
        nativeEvent: e
      };
      ImageUriCache.add(resolveAssetUri(source));

      _this._updateImageState(STATUS_LOADED);

      if (onLoad) {
        onLoad(event);
      }

      _this._onLoadEnd();
    };

    _this._setImageRef = function (ref) {
      _this._imageRef = ref;
    };

    var uri = resolveAssetUri(props.source);
    var shouldDisplaySource = ImageUriCache.has(uri);
    _this.state = {
      layout: {},
      shouldDisplaySource: shouldDisplaySource
    };
    _this._imageState = getImageState(uri, shouldDisplaySource);
    _this._filterId = filterId;
    filterId++;
    return _this;
  }

  var _proto = Image.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._isMounted = true;

    if (this._imageState === STATUS_PENDING) {
      this._createImageLoader();
    } else if (this._imageState === STATUS_LOADED) {
      this._onLoad({
        target: this._imageRef
      });
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var prevUri = resolveAssetUri(prevProps.source);
    var uri = resolveAssetUri(this.props.source);
    var hasDefaultSource = this.props.defaultSource != null;

    if (prevUri !== uri) {
      ImageUriCache.remove(prevUri);
      var isPreviouslyLoaded = ImageUriCache.has(uri);
      isPreviouslyLoaded && ImageUriCache.add(uri);

      this._updateImageState(getImageState(uri, isPreviouslyLoaded), hasDefaultSource);
    } else if (hasDefaultSource && prevProps.defaultSource !== this.props.defaultSource) {
      this._updateImageState(this._imageState, hasDefaultSource);
    }

    if (this._imageState === STATUS_PENDING) {
      this._createImageLoader();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var uri = resolveAssetUri(this.props.source);
    ImageUriCache.remove(uri);

    this._destroyImageLoader();

    this._isMounted = false;
  };

  _proto.render = function render() {
    var shouldDisplaySource = this.state.shouldDisplaySource;

    var _this$props3 = this.props,
        accessibilityLabel = _this$props3.accessibilityLabel,
        accessible = _this$props3.accessible,
        blurRadius = _this$props3.blurRadius,
        defaultSource = _this$props3.defaultSource,
        draggable = _this$props3.draggable,
        source = _this$props3.source,
        testID = _this$props3.testID,
        capInsets = _this$props3.capInsets,
        onError = _this$props3.onError,
        onLayout = _this$props3.onLayout,
        onLoad = _this$props3.onLoad,
        onLoadEnd = _this$props3.onLoadEnd,
        onLoadStart = _this$props3.onLoadStart,
        resizeMethod = _this$props3.resizeMethod,
        resizeMode = _this$props3.resizeMode,
        other = _objectWithoutPropertiesLoose(_this$props3, ["accessibilityLabel", "accessible", "blurRadius", "defaultSource", "draggable", "source", "testID", "capInsets", "onError", "onLayout", "onLoad", "onLoadEnd", "onLoadStart", "resizeMethod", "resizeMode"]);

    if (process.env.NODE_ENV !== 'production') {
      if (this.props.src) {
        console.warn('The <Image> component requires a `source` property rather than `src`.');
      }

      if (this.props.children) {
        throw new Error('The <Image> component cannot contain children. If you want to render content on top of the image, consider using the <ImageBackground> component or absolute positioning.');
      }
    }

    var selectedSource = shouldDisplaySource ? source : defaultSource;
    var displayImageUri = resolveAssetUri(selectedSource);
    var imageSizeStyle = resolveAssetDimensions(selectedSource);
    var backgroundImage = displayImageUri ? "url(\"" + displayImageUri + "\")" : null;

    var flatStyle = _objectSpread({}, StyleSheet.flatten(this.props.style));

    var finalResizeMode = resizeMode || flatStyle.resizeMode || ImageResizeMode.cover; // CSS filters

    var filters = [];
    var tintColor = flatStyle.tintColor;

    if (flatStyle.filter) {
      filters.push(flatStyle.filter);
    }

    if (blurRadius) {
      filters.push("blur(" + blurRadius + "px)");
    }

    if (flatStyle.shadowOffset) {
      var shadowString = resolveShadowValue(flatStyle);

      if (shadowString) {
        filters.push("drop-shadow(" + shadowString + ")");
      }
    }

    if (flatStyle.tintColor) {
      filters.push("url(#tint-" + this._filterId + ")");
    } // these styles were converted to filters


    delete flatStyle.shadowColor;
    delete flatStyle.shadowOpacity;
    delete flatStyle.shadowOffset;
    delete flatStyle.shadowRadius;
    delete flatStyle.tintColor; // these styles are not supported on View

    delete flatStyle.overlayColor;
    delete flatStyle.resizeMode; // Accessibility image allows users to trigger the browser's image context menu

    var hiddenImage = displayImageUri ? createElement('img', {
      alt: accessibilityLabel || '',
      classList: [classes.accessibilityImage],
      draggable: draggable || false,
      ref: this._setImageRef,
      src: displayImageUri
    }) : null;
    return React.createElement(View, _extends({}, other, {
      accessibilityLabel: accessibilityLabel,
      accessible: accessible,
      onLayout: this._createLayoutHandler(finalResizeMode),
      style: [styles.root, this.context.isInAParentText && styles.inline, imageSizeStyle, flatStyle],
      testID: testID
    }), React.createElement(View, {
      style: [styles.image, resizeModeStyles[finalResizeMode], this._getBackgroundSize(finalResizeMode), backgroundImage && {
        backgroundImage: backgroundImage
      }, filters.length > 0 && {
        filter: filters.join(' ')
      }]
    }), hiddenImage, createTintColorSVG(tintColor, this._filterId));
  };

  _proto._createImageLoader = function _createImageLoader() {
    var source = this.props.source;

    this._destroyImageLoader();

    var uri = resolveAssetUri(source);
    this._imageRequestId = ImageLoader.load(uri, this._onLoad, this._onError);

    this._onLoadStart();
  };

  _proto._destroyImageLoader = function _destroyImageLoader() {
    if (this._imageRequestId) {
      ImageLoader.abort(this._imageRequestId);
      this._imageRequestId = null;
    }
  };

  _proto._onLoadEnd = function _onLoadEnd() {
    var onLoadEnd = this.props.onLoadEnd;

    if (onLoadEnd) {
      onLoadEnd();
    }
  };

  _proto._onLoadStart = function _onLoadStart() {
    var _this$props4 = this.props,
        defaultSource = _this$props4.defaultSource,
        onLoadStart = _this$props4.onLoadStart;

    this._updateImageState(STATUS_LOADING, defaultSource != null);

    if (onLoadStart) {
      onLoadStart();
    }
  };

  _proto._updateImageState = function _updateImageState(status, hasDefaultSource) {
    if (hasDefaultSource === void 0) {
      hasDefaultSource = false;
    }

    this._imageState = status;
    var shouldDisplaySource = this._imageState === STATUS_LOADED || this._imageState === STATUS_LOADING && !hasDefaultSource; // only triggers a re-render when the image is loading and has no default image (to support PJPEG), loaded, or failed

    if (shouldDisplaySource !== this.state.shouldDisplaySource) {
      if (this._isMounted) {
        this.setState(function () {
          return {
            shouldDisplaySource: shouldDisplaySource
          };
        });
      }
    }
  };

  return Image;
}(Component);

Image.displayName = 'Image';
Image.contextTypes = {
  isInAParentText: bool
};
Image.defaultProps = {
  style: emptyObject
};
Image.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, ViewPropTypes, {
  blurRadius: number,
  defaultSource: ImageSourcePropType,
  draggable: bool,
  onError: func,
  onLayout: func,
  onLoad: func,
  onLoadEnd: func,
  onLoadStart: func,
  resizeMode: oneOf(Object.keys(ImageResizeMode)),
  source: ImageSourcePropType,
  style: StyleSheetPropType(ImageStylePropTypes),
  // compatibility with React Native

  /* eslint-disable react/sort-prop-types */
  capInsets: shape({
    top: number,
    left: number,
    bottom: number,
    right: number
  }),
  resizeMethod: oneOf(['auto', 'resize', 'scale'])
  /* eslint-enable react/sort-prop-types */

}) : {};
var classes = css.create({
  accessibilityImage: _objectSpread({}, StyleSheet.absoluteFillObject, {
    height: '100%',
    opacity: 0,
    width: '100%',
    zIndex: -1
  })
});
var styles = StyleSheet.create({
  root: {
    flexBasis: 'auto',
    overflow: 'hidden',
    zIndex: 0
  },
  inline: {
    display: 'inline-flex'
  },
  image: _objectSpread({}, StyleSheet.absoluteFillObject, {
    backgroundColor: 'transparent',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',
    zIndex: -1
  })
});
var resizeModeStyles = StyleSheet.create({
  center: {
    backgroundSize: 'auto'
  },
  contain: {
    backgroundSize: 'contain'
  },
  cover: {
    backgroundSize: 'cover'
  },
  none: {
    backgroundPosition: '0 0',
    backgroundSize: 'auto'
  },
  repeat: {
    backgroundPosition: '0 0',
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto'
  },
  stretch: {
    backgroundSize: '100% 100%'
  }
});
export default applyNativeMethods(Image);