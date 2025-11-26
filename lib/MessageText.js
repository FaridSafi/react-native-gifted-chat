import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { LinkParser } from './linkParser';
export const MessageText = ({ currentMessage, position = 'left', containerStyle, textStyle, linkStyle: linkStyleProp, customTextStyle, onPress: onPressProp, matchers, email = true, phone = true, url = true, hashtag = false, mention = false, hashtagUrl, mentionUrl, stripPrefix = false, }) => {
    const linkStyle = useMemo(() => StyleSheet.flatten([
        styles.link,
        linkStyleProp?.[position],
    ]), [position, linkStyleProp]);
    const style = useMemo(() => [
        styles[`text_${position}`],
        textStyle?.[position],
        customTextStyle,
    ], [position, textStyle, customTextStyle]);
    const handlePress = useCallback((url, type) => {
        onPressProp?.(currentMessage, url, type);
    }, [onPressProp, currentMessage]);
    return (<View style={[styles.container, containerStyle?.[position]]}>
      <LinkParser text={currentMessage.text} matchers={matchers} email={email} phone={phone} url={url} hashtag={hashtag} mention={mention} hashtagUrl={hashtagUrl} mentionUrl={mentionUrl} stripPrefix={stripPrefix} linkStyle={linkStyle} textStyle={style} onPress={onPressProp ? handlePress : undefined} TextComponent={Text}/>
    </View>);
};
const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 20,
    },
    text_left: {
        color: 'black',
    },
    text_right: {
        color: 'white',
    },
    link: {
        textDecorationLine: 'underline',
    },
});
//# sourceMappingURL=MessageText.js.map