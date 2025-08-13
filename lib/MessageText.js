import React from 'react';
import { Linking, StyleSheet, View, } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { useChatContext } from './GiftedChatContext';
import { error } from './logging';
const WWW_URL_PATTERN = /^www\./i;
const { textStyle } = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        lineHeight: 20,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
    },
});
const styles = {
    left: StyleSheet.create({
        container: {},
        text: {
            color: 'black',
            ...textStyle,
        },
        link: {
            color: 'black',
            textDecorationLine: 'underline',
        },
    }),
    right: StyleSheet.create({
        container: {},
        text: {
            color: 'white',
            ...textStyle,
        },
        link: {
            color: 'white',
            textDecorationLine: 'underline',
        },
    }),
};
const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];
export function MessageText({ currentMessage = {}, optionTitles = DEFAULT_OPTION_TITLES, position = 'left', containerStyle, textStyle, linkStyle: linkStyleProp, customTextStyle, parsePatterns, textProps, }) {
    const { actionSheet } = useChatContext();
    // TODO: React.memo
    // const shouldComponentUpdate = (nextProps: MessageTextProps<TMessage>) => {
    //   return (
    //     !!currentMessage &&
    //     !!nextProps.currentMessage &&
    //     currentMessage.text !== nextProps.currentMessage.text
    //   )
    // }
    const onUrlPress = (url) => {
        // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
        // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
        if (WWW_URL_PATTERN.test(url))
            onUrlPress(`https://${url}`);
        else
            Linking.openURL(url).catch(e => {
                error(e, 'No handler for URL:', url);
            });
    };
    const onPhonePress = (phone) => {
        const options = optionTitles && optionTitles.length > 0
            ? optionTitles.slice(0, 3)
            : DEFAULT_OPTION_TITLES;
        const cancelButtonIndex = options.length - 1;
        actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        }, (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    Linking.openURL(`tel:${phone}`).catch(e => {
                        error(e, 'No handler for telephone');
                    });
                    break;
                case 1:
                    Linking.openURL(`sms:${phone}`).catch(e => {
                        error(e, 'No handler for text');
                    });
                    break;
            }
        });
    };
    const onEmailPress = (email) => Linking.openURL(`mailto:${email}`).catch(e => error(e, 'No handler for mailto'));
    const linkStyle = [
        styles[position].link,
        linkStyleProp?.[position],
    ];
    return (<View style={[
            styles[position].container,
            containerStyle?.[position],
        ]}>
      <ParsedText style={[
            styles[position].text,
            textStyle?.[position],
            customTextStyle,
        ]} parse={[
            ...(parsePatterns ? parsePatterns(linkStyle) : []),
            { type: 'url', style: linkStyle, onPress: onUrlPress },
            { type: 'phone', style: linkStyle, onPress: onPhonePress },
            { type: 'email', style: linkStyle, onPress: onEmailPress },
        ]} childrenProps={{ ...textProps }}>
        {currentMessage.text}
      </ParsedText>
    </View>);
}
//# sourceMappingURL=MessageText.js.map