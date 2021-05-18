import React, { Component } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import PropTypes from 'prop-types';
import Color from './Color';
import { StylePropType } from './utils';
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 5,
        marginBottom: 10,
    },
    text: {
        backgroundColor: Color.backgroundTransparent,
        color: Color.defaultColor,
        fontSize: 12,
        fontWeight: '300',
    },
});
export default class SystemMessage extends Component {
    render() {
        const { currentMessage, containerStyle, wrapperStyle, textStyle, } = this.props;
        if (currentMessage) {
            return (<View style={[styles.container, containerStyle]}>
          <View style={wrapperStyle}>
            <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>
          </View>
        </View>);
        }
        return null;
    }
}
SystemMessage.defaultProps = {
    currentMessage: {
        system: false,
    },
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
};
SystemMessage.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
};
//# sourceMappingURL=SystemMessage.js.map