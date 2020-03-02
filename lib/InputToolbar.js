import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, Keyboard, ViewPropTypes, } from 'react-native';
import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';
import Color from './Color';
const styles = StyleSheet.create({
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Color.defaultColor,
        backgroundColor: Color.white,
        bottom: 0,
        left: 0,
        right: 0,
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    accessory: {
        height: 44,
    },
});
export default class InputToolbar extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            position: 'absolute',
        };
        this.keyboardWillShowListener = undefined;
        this.keyboardWillHideListener = undefined;
        this.keyboardWillShow = () => {
            if (this.state.position !== 'relative') {
                this.setState({
                    position: 'relative',
                });
            }
        };
        this.keyboardWillHide = () => {
            if (this.state.position !== 'absolute') {
                this.setState({
                    position: 'absolute',
                });
            }
        };
    }
    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    componentWillUnmount() {
        if (this.keyboardWillShowListener) {
            this.keyboardWillShowListener.remove();
        }
        if (this.keyboardWillHideListener) {
            this.keyboardWillHideListener.remove();
        }
    }
    renderActions() {
        const { containerStyle, ...props } = this.props;
        if (this.props.renderActions) {
            return this.props.renderActions(props);
        }
        else if (this.props.onPressActionButton) {
            return <Actions {...props}/>;
        }
        return null;
    }
    renderSend() {
        if (this.props.renderSend) {
            return this.props.renderSend(this.props);
        }
        return <Send {...this.props}/>;
    }
    renderComposer() {
        if (this.props.renderComposer) {
            return this.props.renderComposer(this.props);
        }
        return <Composer {...this.props}/>;
    }
    renderAccessory() {
        if (this.props.renderAccessory) {
            return (<View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>);
        }
        return null;
    }
    render() {
        return (<View style={[
            styles.container,
            this.props.containerStyle,
            { position: this.state.position },
        ]}>
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>);
    }
}
InputToolbar.defaultProps = {
    renderAccessory: null,
    renderActions: null,
    renderSend: null,
    renderComposer: null,
    containerStyle: {},
    primaryStyle: {},
    accessoryStyle: {},
    onPressActionButton: () => { },
};
InputToolbar.propTypes = {
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,
    renderComposer: PropTypes.func,
    onPressActionButton: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    primaryStyle: ViewPropTypes.style,
    accessoryStyle: ViewPropTypes.style,
};
//# sourceMappingURL=InputToolbar.js.map