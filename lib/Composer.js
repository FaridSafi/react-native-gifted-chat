import React, { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View, } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Color } from './Color';
import { useColorScheme } from './hooks/useColorScheme';
import stylesCommon, { getColorSchemeStyle } from './styles';
export function Composer({ text = '', textInputProps, }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const placeholder = textInputProps?.placeholder ?? 'Type a message...';
    const minHeight = useMemo(() => Platform.select({
        web: styles.textInput.lineHeight + styles.textInput.paddingTop + styles.textInput.paddingBottom,
        default: undefined,
    }), []);
    const [height, setHeight] = useState(minHeight);
    const handleContentSizeChange = useMemo(() => {
        if (Platform.OS === 'web')
            return (e) => {
                const contentHeight = e.nativeEvent.contentSize.height;
                setHeight(Math.max(minHeight ?? 0, contentHeight));
            };
        return undefined;
    }, [minHeight]);
    const handleChange = useCallback((event) => {
        if (Platform.OS === 'web')
            // Reset height to 0 to get the correct scrollHeight
            // @ts-expect-error - web-specific code
            window.requestAnimationFrame(() => {
                // @ts-expect-error - web-specific code
                event.nativeEvent.target.style.height = '0px';
                // @ts-expect-error - web-specific code
                event.nativeEvent.target.style.height = `${event.nativeEvent.target.scrollHeight}px`;
            });
    }, []);
    return (<View style={stylesCommon.fill}>
      <TextInput testID={placeholder} accessible accessibilityLabel={placeholder} placeholderTextColor={textInputProps?.placeholderTextColor ?? (isDark ? '#888' : Color.defaultColor)} value={text} enablesReturnKeyAutomatically underlineColorAndroid='transparent' keyboardAppearance={isDark ? 'dark' : 'default'} multiline placeholder={placeholder} onContentSizeChange={handleContentSizeChange} onChange={handleChange} {...textInputProps} style={[getColorSchemeStyle(styles, 'textInput', colorScheme), stylesWeb.textInput, { height }, textInputProps?.style]}/>
    </View>);
}
const styles = StyleSheet.create({
    textInput: {
        fontSize: 16,
        lineHeight: 22,
        paddingTop: 8,
        paddingBottom: 10,
        paddingHorizontal: 8,
    },
    textInput_dark: {
        color: '#fff',
    },
});
const stylesWeb = StyleSheet.create({
    textInput: {
        /* @ts-expect-error - web-specific styles */
        outlineStyle: 'none',
    },
});
//# sourceMappingURL=Composer.js.map