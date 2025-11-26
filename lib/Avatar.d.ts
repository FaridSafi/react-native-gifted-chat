import React, { ReactNode } from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { IMessage, LeftRightStyle, User } from './Models';
export interface AvatarProps<TMessage extends IMessage> {
    currentMessage: TMessage;
    previousMessage?: TMessage;
    nextMessage?: TMessage;
    position: 'left' | 'right';
    isAvatarOnTop?: boolean;
    isAvatarVisibleForEveryMessage?: boolean;
    imageStyle?: LeftRightStyle<ImageStyle>;
    containerStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: TextStyle;
    renderAvatar?(props: Omit<AvatarProps<TMessage>, 'renderAvatar'>): ReactNode;
    onPressAvatar?: (user: User) => void;
    onLongPressAvatar?: (user: User) => void;
}
export declare function Avatar<TMessage extends IMessage = IMessage>(props: AvatarProps<TMessage>): React.JSX.Element | null;
