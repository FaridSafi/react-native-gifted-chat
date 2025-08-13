import React, { useCallback, useRef } from 'react';
import { Platform, StyleSheet, TextInput, } from 'react-native';
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant';
import Color from './Color';
import stylesCommon from './styles';
export function Composer({ composerHeight = MIN_COMPOSER_HEIGHT, disableComposer = false, keyboardAppearance = 'default', multiline = true, onInputSizeChanged, onTextChanged, placeholder = DEFAULT_PLACEHOLDER, placeholderTextColor = Color.defaultColor, text = '', textInputAutoFocus = false, textInputProps, textInputStyle, }) {
    const dimensionsRef = useRef(null);
    const determineInputSizeChange = useCallback((dimensions) => {
        // Support earlier versions of React Native on Android.
        if (!dimensions)
            return;
        if (!dimensionsRef.current ||
            (dimensionsRef.current &&
                (dimensionsRef.current.width !== dimensions.width ||
                    dimensionsRef.current.height !== dimensions.height))) {
            dimensionsRef.current = dimensions;
            onInputSizeChanged?.(dimensions);
        }
    }, [onInputSizeChanged]);
    const handleContentSizeChange = useCallback(({ nativeEvent: { contentSize }, }) => determineInputSizeChange(contentSize), [determineInputSizeChange]);
    return (<TextInput testID={placeholder} accessible accessibilityLabel={placeholder} placeholder={placeholder} placeholderTextColor={placeholderTextColor} multiline={multiline} editable={!disableComposer} onContentSizeChange={handleContentSizeChange} onChangeText={onTextChanged} style={[
            stylesCommon.fill,
            styles.textInput,
            textInputStyle,
            {
                height: composerHeight,
                ...Platform.select({
                    web: {
                        outlineWidth: 0,
                        outlineColor: 'transparent',
                        outlineOffset: 0,
                    },
                }),
            },
        ]} autoFocus={textInputAutoFocus} value={text} enablesReturnKeyAutomatically underlineColorAndroid='transparent' keyboardAppearance={keyboardAppearance} {...textInputProps}/>);
}
const styles = StyleSheet.create({
    textInput: {
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 22,
        ...Platform.select({
            web: {
                paddingTop: 6,
                paddingLeft: 4,
            },
        }),
        marginTop: Platform.select({
            ios: 6,
            android: 0,
            web: 6,
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3,
            web: 4,
        }),
    },
});
//# sourceMappingURL=Composer.js.map