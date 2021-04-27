import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import { Type } from '../constants';
import { Node } from './Node';
import { Range } from './Range';
export var BlankLine = /*#__PURE__*/function (_Node) {
  _inherits(BlankLine, _Node);

  var _super = _createSuper(BlankLine);

  function BlankLine() {
    _classCallCheck(this, BlankLine);

    return _super.call(this, Type.BLANK_LINE);
  }
  /* istanbul ignore next */


  _createClass(BlankLine, [{
    key: "parse",

    /**
     * Parses a blank line from the source
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first \n character
     * @returns {number} - Index of the character after this
     */
    value: function parse(context, start) {
      this.context = context;
      this.range = new Range(start, start + 1);
      return start + 1;
    }
  }, {
    key: "includesTrailingLines",
    get: function get() {
      // This is never called from anywhere, but if it were,
      // this is the value it should return.
      return true;
    }
  }]);

  return BlankLine;
}(Node);