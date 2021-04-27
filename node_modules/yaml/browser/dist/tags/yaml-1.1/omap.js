import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import { YAMLSemanticError } from '../../errors';
import { toJSON as _toJSON } from '../../toJSON';
import { YAMLMap } from '../../schema/Map';
import { Pair } from '../../schema/Pair';
import { Scalar } from '../../schema/Scalar';
import { YAMLSeq } from '../../schema/Seq';
import { createPairs, parsePairs } from './pairs';
export var YAMLOMap = /*#__PURE__*/function (_YAMLSeq) {
  _inherits(YAMLOMap, _YAMLSeq);

  var _super = _createSuper(YAMLOMap);

  function YAMLOMap() {
    var _this;

    _classCallCheck(this, YAMLOMap);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "add", YAMLMap.prototype.add.bind(_assertThisInitialized(_this)));

    _defineProperty(_assertThisInitialized(_this), "delete", YAMLMap.prototype.delete.bind(_assertThisInitialized(_this)));

    _defineProperty(_assertThisInitialized(_this), "get", YAMLMap.prototype.get.bind(_assertThisInitialized(_this)));

    _defineProperty(_assertThisInitialized(_this), "has", YAMLMap.prototype.has.bind(_assertThisInitialized(_this)));

    _defineProperty(_assertThisInitialized(_this), "set", YAMLMap.prototype.set.bind(_assertThisInitialized(_this)));

    _this.tag = YAMLOMap.tag;
    return _this;
  }

  _createClass(YAMLOMap, [{
    key: "toJSON",
    value: function toJSON(_, ctx) {
      var map = new Map();
      if (ctx && ctx.onCreate) ctx.onCreate(map);

      var _iterator = _createForOfIteratorHelper(this.items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var pair = _step.value;
          var key = void 0,
              value = void 0;

          if (pair instanceof Pair) {
            key = _toJSON(pair.key, '', ctx);
            value = _toJSON(pair.value, key, ctx);
          } else {
            key = _toJSON(pair, '', ctx);
          }

          if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
          map.set(key, value);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return map;
    }
  }]);

  return YAMLOMap;
}(YAMLSeq);

_defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

function parseOMap(doc, cst) {
  var pairs = parsePairs(doc, cst);
  var seenKeys = [];

  var _iterator2 = _createForOfIteratorHelper(pairs.items),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var key = _step2.value.key;

      if (key instanceof Scalar) {
        if (seenKeys.includes(key.value)) {
          var msg = 'Ordered maps must not include duplicate keys';
          throw new YAMLSemanticError(cst, msg);
        } else {
          seenKeys.push(key.value);
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return Object.assign(new YAMLOMap(), pairs);
}

function createOMap(schema, iterable, ctx) {
  var pairs = createPairs(schema, iterable, ctx);
  var omap = new YAMLOMap();
  omap.items = pairs.items;
  return omap;
}

export var omap = {
  identify: function identify(value) {
    return value instanceof Map;
  },
  nodeClass: YAMLOMap,
  default: false,
  tag: 'tag:yaml.org,2002:omap',
  resolve: parseOMap,
  createNode: createOMap
};