import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import Color from './Color';
import stylesCommon from './styles';
const styles = StyleSheet.create({
    container: {
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
export function SystemMessage({ currentMessage, containerStyle, wrapperStyle, textStyle, children, }) {
    if (currentMessage == null || currentMessage.system === false)
        return null;
    return (<View style={[stylesCommon.fill, stylesCommon.centerItems, styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        {!!currentMessage.text && <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>}
        {children}
      </View>
    </View>);
}
//# sourceMappingURL=SystemMessage.js.map