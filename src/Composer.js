import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 16,
        marginTop: Platform.select({
            ios: 6,
            android: 0,
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3,
        }),
    },
});
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant';
import Color from './Color';
export default class Composer extends React.Component {
    constructor() {
        super(...arguments);
        this.contentSize = undefined;
        this.onContentSizeChange = (e) => {
            const { contentSize } = e.nativeEvent;
            // Support earlier versions of React Native on Android.
            if (!contentSize) {
                return;
            }
            if (!this.contentSize ||
                (this.contentSize &&
                    (this.contentSize.width !== contentSize.width ||
                        this.contentSize.height !== contentSize.height))) {
                this.contentSize = contentSize;
                this.props.onInputSizeChanged(this.contentSize);
            }
        };
        this.onChangeText = (text) => {
            this.props.onTextChanged(text);
        };
    }
    render() {
        return (<TextInput testID={this.props.placeholder} accessible accessibilityLabel={this.props.placeholder} placeholder={this.props.placeholder} placeholderTextColor={this.props.placeholderTextColor} multiline={this.props.multiline} onChange={this.onContentSizeChange} onContentSizeChange={this.onContentSizeChange} onChangeText={this.onChangeText} style={[
            styles.textInput,
            this.props.textInputStyle,
            { height: this.props.composerHeight },
        ]} autoFocus={this.props.textInputAutoFocus} value={this.props.text} enablesReturnKeyAutomatically underlineColorAndroid='transparent' keyboardAppearance={this.props.keyboardAppearance} {...this.props.textInputProps}/>);
    }
}
Composer.defaultProps = {
    composerHeight: MIN_COMPOSER_HEIGHT,
    text: '',
    placeholderTextColor: Color.defaultColor,
    placeholder: DEFAULT_PLACEHOLDER,
    textInputProps: null,
    multiline: true,
    textInputStyle: {},
    textInputAutoFocus: false,
    keyboardAppearance: 'default',
    onTextChanged: () => { },
    onInputSizeChanged: () => { },
};
Composer.propTypes = {
    composerHeight: PropTypes.number,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    textInputProps: PropTypes.object,
    onTextChanged: PropTypes.func,
    onInputSizeChanged: PropTypes.func,
    multiline: PropTypes.bool,
    textInputStyle: PropTypes.any,
    textInputAutoFocus: PropTypes.bool,
    keyboardAppearance: PropTypes.string,
};
//# sourceMappingURL=Composer.js.map