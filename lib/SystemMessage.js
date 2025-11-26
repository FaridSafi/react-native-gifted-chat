import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { Color } from './Color';
import { MessageText } from './MessageText';
import stylesCommon from './styles';
export function SystemMessage({ currentMessage, containerStyle, messageContainerStyle, textStyle, messageTextProps, children, }) {
    if (currentMessage == null)
        return null;
    return (<View style={[stylesCommon.fill, styles.container, containerStyle]}>
      {!!currentMessage.text && (<MessageText currentMessage={currentMessage} customTextStyle={[styles.text, textStyle]} position='left' containerStyle={{ left: [styles.messageContainer, messageContainerStyle] }} {...messageTextProps}/>)}
      {children}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 5,
        marginHorizontal: 10,
        alignItems: 'flex-end',
    },
    messageContainer: {
        marginVertical: 0,
        marginHorizontal: 0,
    },
    text: {
        backgroundColor: Color.backgroundTransparent,
        fontSize: 12,
        fontWeight: '300',
    },
});
//# sourceMappingURL=SystemMessage.js.map