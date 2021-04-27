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
import ColorPropType from '../ColorPropType';
import StyleSheet from '../StyleSheet';
import TouchableOpacity from '../TouchableOpacity';
import Text from '../Text';
import { bool, func, string } from 'prop-types';
import React, { Component } from 'react';

var Button =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Button, _Component);

  function Button() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Button.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        accessibilityLabel = _this$props.accessibilityLabel,
        color = _this$props.color,
        disabled = _this$props.disabled,
        onPress = _this$props.onPress,
        testID = _this$props.testID,
        title = _this$props.title;
    return React.createElement(TouchableOpacity, {
      accessibilityLabel: accessibilityLabel,
      accessibilityRole: "button",
      disabled: disabled,
      onPress: onPress,
      style: [styles.button, color && {
        backgroundColor: color
      }, disabled && styles.buttonDisabled],
      testID: testID
    }, React.createElement(Text, {
      style: [styles.text, disabled && styles.textDisabled]
    }, title));
  };

  return Button;
}(Component);

Button.propTypes = process.env.NODE_ENV !== "production" ? {
  accessibilityLabel: string,
  color: ColorPropType,
  disabled: bool,
  onPress: func.isRequired,
  testID: string,
  title: string.isRequired
} : {};
var styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 2
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    padding: 8,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  buttonDisabled: {
    backgroundColor: '#dfdfdf'
  },
  textDisabled: {
    color: '#a1a1a1'
  }
});
export default Button;