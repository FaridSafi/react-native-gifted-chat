import PropTypes from 'prop-types';
import React, { ReactNode } from 'react';
import { ImageStyle, ViewStyle } from 'react-native';
import { Omit, IMessage, User, LeftRightStyle } from './types';
interface AvatarProps {
    currentMessage?: IMessage;
    previousMessage?: IMessage;
    nextMessage?: IMessage;
    position: 'left' | 'right';
    renderAvatarOnTop?: boolean;
    showAvatarForEveryMessage?: boolean;
    imageStyle?: LeftRightStyle<ImageStyle>;
    containerStyle?: LeftRightStyle<ViewStyle>;
    renderAvatar?(props: Omit<AvatarProps, 'renderAvatar'>): ReactNode;
    onPressAvatar?(user: User): void;
}
export default class Avatar extends React.Component<AvatarProps> {
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
    };
    static propTypes: {
        renderAvatarOnTop: PropTypes.Requireable<boolean>;
        showAvatarForEveryMessage: PropTypes.Requireable<boolean>;
        position: PropTypes.Requireable<string>;
        currentMessage: PropTypes.Requireable<object>;
        previousMessage: PropTypes.Requireable<object>;
        nextMessage: PropTypes.Requireable<object>;
        onPressAvatar: PropTypes.Requireable<(...args: any[]) => any>;
        renderAvatar: PropTypes.Requireable<(...args: any[]) => any>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
        imageStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
    };
    renderAvatar(): {} | null | undefined;
    render(): JSX.Element | null;
}
export {};
