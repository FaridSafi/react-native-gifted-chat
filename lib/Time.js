import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import { Text } from 'react-native-gesture-handler';
import { Color } from './Color';
import { TIME_FORMAT } from './Constant';
import { useChatContext } from './GiftedChatContext';
import { getStyleWithPosition } from './styles';
const styles = StyleSheet.create({
    text: {
        fontSize: 10,
        textAlign: 'right',
    },
    text_left: {
        color: Color.timeTextColor,
    },
    text_right: {
        color: Color.white,
    },
});
export const Time = ({ position = 'left', containerStyle, currentMessage, timeFormat = TIME_FORMAT, timeTextStyle, }) => {
    const { getLocale } = useChatContext();
    const formattedTime = useMemo(() => {
        if (!currentMessage)
            return null;
        return dayjs(currentMessage.createdAt).locale(getLocale()).format(timeFormat);
    }, [currentMessage, getLocale, timeFormat]);
    if (!currentMessage)
        return null;
    return (<View style={containerStyle?.[position]}>
      <Text style={[
            getStyleWithPosition(styles, 'text', position),
            timeTextStyle?.[position],
        ]}>
        {formattedTime}
      </Text>
    </View>);
};
//# sourceMappingURL=Time.js.map