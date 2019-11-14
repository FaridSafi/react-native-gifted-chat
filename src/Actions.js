import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewPropTypes, } from 'react-native';
import Color from './Color';
export default class Actions extends React.Component {
    constructor() {
        super(...arguments);
        this.onActionsPress = () => {
            const { options } = this.props;
            const optionKeys = Object.keys(options);
            const cancelButtonIndex = optionKeys.indexOf('Cancel');
            this.context.actionSheet().showActionSheetWithOptions({
                options: optionKeys,
                cancelButtonIndex,
                tintColor: this.props.optionTintColor,
            }, (buttonIndex) => {
                const key = optionKeys[buttonIndex];
                if (key) {
                    options[key](this.props);
                }
            });
        };
    }
    renderIcon() {
        if (this.props.icon) {
            return this.props.icon();
        }
        return (<View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>);
    }
    render() {
        return (<TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={this.props.onPressActionButton || this.onActionsPress}>
        {this.renderIcon()}
      </TouchableOpacity>);
    }
}
Actions.defaultProps = {
    options: {},
    optionTintColor: Color.optionTintColor,
    icon: undefined,
    containerStyle: {},
    iconTextStyle: {},
    wrapperStyle: {},
};
Actions.propTypes = {
    onSend: PropTypes.func,
    options: PropTypes.object,
    optionTintColor: PropTypes.string,
    icon: PropTypes.func,
    onPressActionButton: PropTypes.func,
    wrapperStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
};
Actions.contextTypes = {
    actionSheet: PropTypes.func,
};
const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: Color.defaultColor,
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: Color.defaultColor,
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: Color.backgroundTransparent,
        textAlign: 'center',
    },
});
//# sourceMappingURL=Actions.js.map