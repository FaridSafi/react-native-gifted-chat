import React, { useCallback } from 'react';
import { StyleSheet, View, } from 'react-native';
import { GiftedAvatar } from './GiftedAvatar';
import { isSameUser, isSameDay } from './utils';
const styles = {
    left: StyleSheet.create({
        container: {
            marginRight: 8,
        },
        onTop: {
            alignSelf: 'flex-start',
        },
        image: {
            height: 36,
            width: 36,
            borderRadius: 18,
        },
    }),
    right: StyleSheet.create({
        container: {
            marginLeft: 8,
        },
        onTop: {
            alignSelf: 'flex-start',
        },
        image: {
            height: 36,
            width: 36,
            borderRadius: 18,
        },
    }),
};
export function Avatar(props) {
    const { renderAvatarOnTop, showAvatarForEveryMessage, containerStyle, position, currentMessage, renderAvatar, previousMessage, nextMessage, imageStyle, onPressAvatar, onLongPressAvatar, } = props;
    const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
    const renderAvatarComponent = useCallback(() => {
        if (renderAvatar)
            return renderAvatar({
                renderAvatarOnTop,
                showAvatarForEveryMessage,
                containerStyle,
                position,
                currentMessage,
                previousMessage,
                nextMessage,
                imageStyle,
                onPressAvatar,
                onLongPressAvatar,
            });
        if (currentMessage)
            return (<GiftedAvatar avatarStyle={[
                    styles[position].image,
                    imageStyle?.[position],
                ]} user={currentMessage.user} onPress={() => onPressAvatar?.(currentMessage.user)} onLongPress={() => onLongPressAvatar?.(currentMessage.user)}/>);
        return null;
    }, [
        renderAvatar,
        renderAvatarOnTop,
        showAvatarForEveryMessage,
        containerStyle,
        position,
        currentMessage,
        previousMessage,
        nextMessage,
        imageStyle,
        onPressAvatar,
        onLongPressAvatar,
    ]);
    if (renderAvatar === null)
        return null;
    if (!showAvatarForEveryMessage &&
        currentMessage &&
        messageToCompare &&
        isSameUser(currentMessage, messageToCompare) &&
        isSameDay(currentMessage, messageToCompare))
        return (<View style={[
                styles[position].container,
                containerStyle?.[position],
            ]}>
        <GiftedAvatar avatarStyle={[
                styles[position].image,
                imageStyle?.[position],
            ]}/>
      </View>);
    return (<View style={[
            styles[position].container,
            renderAvatarOnTop && styles[position].onTop,
            containerStyle?.[position],
        ]}>
      {renderAvatarComponent()}
    </View>);
}
//# sourceMappingURL=Avatar.js.map