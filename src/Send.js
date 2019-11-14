import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewPropTypes, } from 'react-native';
import Color from './Color';
const styles = StyleSheet.create({
    container: {
        height: 44,
        justifyContent: 'flex-end',
    },
    text: {
        color: Color.defaultBlue,
        fontWeight: '600',
        fontSize: 17,
        backgroundColor: Color.backgroundTransparent,
        marginBottom: 12,
        marginLeft: 10,
        marginRight: 10,
    },
});
export default class Send extends Component {
    render() {
        const { text, containerStyle, onSend, children, textStyle, label, alwaysShowSend, disabled, } = this.props;
        if (alwaysShowSend || (text && text.trim().length > 0)) {
            return (<TouchableOpacity testID='send' accessible accessibilityLabel='send' style={[styles.container, containerStyle]} onPress={() => {
                if (text && onSend) {
                    onSend({ text: text.trim() }, true);
                }
            }} accessibilityTraits='button' disabled={disabled}>
          <View>
            {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
          </View>
        </TouchableOpacity>);
        }
        return <View />;
    }
}
Send.defaultProps = {
    text: '',
    onSend: () => { },
    label: 'Send',
    containerStyle: {},
    textStyle: {},
    children: null,
    alwaysShowSend: false,
    disabled: false,
};
Send.propTypes = {
    text: PropTypes.string,
    onSend: PropTypes.func,
    label: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    textStyle: PropTypes.any,
    children: PropTypes.element,
    alwaysShowSend: PropTypes.bool,
    disabled: PropTypes.bool,
};
//# sourceMappingURL=Send.js.map