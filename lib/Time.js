import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import Color from './Color';
import { TIME_FORMAT } from './Constant';
import { useChatContext } from './GiftedChatContext';
const { containerStyle } = StyleSheet.create({
    containerStyle: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
    },
});
const { textStyle } = StyleSheet.create({
    textStyle: {
        fontSize: 10,
        textAlign: 'right',
    },
});
const styles = {
    left: StyleSheet.create({
        container: {
            ...containerStyle,
        },
        text: {
            color: Color.timeTextColor,
            ...textStyle,
        },
    }),
    right: StyleSheet.create({
        container: {
            ...containerStyle,
        },
        text: {
            color: Color.white,
            ...textStyle,
        },
    }),
};
export function Time({ position = 'left', containerStyle, currentMessage, timeFormat = TIME_FORMAT, timeTextStyle, }) {
    const { getLocale } = useChatContext();
    if (currentMessage == null)
        return null;
    return (<View style={[
            styles[position].container,
            containerStyle?.[position],
        ]}>
      <Text style={[
            styles[position].text,
            timeTextStyle?.[position],
        ]}>
        {dayjs(currentMessage.createdAt).locale(getLocale()).format(timeFormat)}
      </Text>
    </View>);
}
//# sourceMappingURL=Time.js.map