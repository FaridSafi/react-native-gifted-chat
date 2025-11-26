import React, { useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Color } from './Color';
import { TouchableOpacity } from './components/TouchableOpacity';
import { TEST_ID } from './Constant';
import { useColorScheme } from './hooks/useColorScheme';
import { getColorSchemeStyle } from './styles';
export const Send = ({ text, containerStyle, children, textStyle, label = 'Send', isSendButtonAlwaysVisible = false, sendButtonProps, onSend, }) => {
    const colorScheme = useColorScheme();
    const opacity = useSharedValue(0);
    const handleOnPress = useCallback(() => {
        const message = { text: text?.trim() };
        if (onSend && message.text?.length)
            onSend(message, true);
    }, [text, onSend]);
    const isVisible = useMemo(() => isSendButtonAlwaysVisible || !!text?.trim().length, [isSendButtonAlwaysVisible, text]);
    useEffect(() => {
        opacity.value = withTiming(isVisible ? 1 : 0, { duration: 200 });
    }, [isVisible, opacity]);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }), [opacity]);
    return (<Animated.View style={[styles.container, containerStyle, animatedStyle]} pointerEvents={isVisible ? 'auto' : 'none'}>
      <TouchableOpacity testID={TEST_ID.SEND_TOUCHABLE} style={styles.touchable} onPress={handleOnPress} accessible accessibilityLabel='send' accessibilityRole='button' {...sendButtonProps}>
        {children ||
            <Text style={[
                    getColorSchemeStyle(styles, 'text', colorScheme),
                    textStyle,
                ]}>
            {label}
          </Text>}
      </TouchableOpacity>
    </Animated.View>);
};
const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
    },
    touchable: {
        justifyContent: 'flex-end',
    },
    text: {
        color: Color.defaultBlue,
        fontWeight: '600',
        fontSize: 17,
        backgroundColor: Color.backgroundTransparent,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    text_dark: {
        color: '#4da6ff',
    },
});
//# sourceMappingURL=Send.js.map