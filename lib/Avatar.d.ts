import PropTypes from 'prop-types';
import React, { ReactNode } from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Omit, IMessage, User, LeftRightStyle } from './Models';
export interface AvatarProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    previousMessage?: TMessage;
    nextMessage?: TMessage;
    position: 'left' | 'right';
    renderAvatarOnTop?: boolean;
    showAvatarForEveryMessage?: boolean;
    imageStyle?: LeftRightStyle<ImageStyle>;
    containerStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: TextStyle;
    renderAvatar?(props: Omit<AvatarProps<TMessage>, 'renderAvatar'>): ReactNode;
    onPressAvatar?(user: User): void;
    onLongPressAvatar?(user: User): void;
}
export default class Avatar<TMessage extends IMessage = IMessage> extends React.Component<AvatarProps<TMessage>> {
    static defaultProps: {
        renderAvatarOnTop: boolean;
        showAvatarForEveryMessage: boolean;
        position: string;
        currentMessage: {
            user: null;
        };
        previousMessage: {};
        nextMessage: {};
        containerStyle: {};
        imageStyle: {};
        onPressAvatar: () => void;
        onLongPressAvatar: () => void;
    };
    static propTypes: {
        renderAvatarOnTop: PropTypes.Requireable<boolean>;
        showAvatarForEveryMessage: PropTypes.Requireable<boolean>;
        position: PropTypes.Requireable<string>;
        currentMessage: PropTypes.Requireable<object>;
        previousMessage: PropTypes.Requireable<object>;
        nextMessage: PropTypes.Requireable<object>;
        onPressAvatar: PropTypes.Requireable<(...args: any[]) => any>;
        onLongPressAvatar: PropTypes.Requireable<(...args: any[]) => any>;
        renderAvatar: PropTypes.Requireable<(...args: any[]) => any>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
        imageStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
    };
    renderAvatar(): {} | null | undefined;
    render(): JSX.Element | null;
}
