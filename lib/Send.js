import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import Color from './Color';
import { TEST_ID } from './Constant';
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
export const Send = ({ text, containerStyle, children, textStyle, label = 'Send', alwaysShowSend = false, disabled = false, sendButtonProps, onSend, }) => {
    const handleOnPress = useCallback(() => {
        if (text && onSend)
            onSend({ text: text.trim() }, true);
    }, [text, onSend]);
    const showSend = useMemo(() => alwaysShowSend || (text && text.trim().length > 0), [alwaysShowSend, text]);
    if (!showSend)
        return null;
    return (<TouchableOpacity testID={TEST_ID.SEND_TOUCHABLE} accessible accessibilityLabel='send' style={[styles.container, containerStyle]} onPress={handleOnPress} accessibilityRole='button' disabled={disabled} {...sendButtonProps}>
      <View>
        {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
      </View>
    </TouchableOpacity>);
};
//# sourceMappingURL=Send.js.map