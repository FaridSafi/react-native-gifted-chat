import PropTypes from 'prop-types';
import React from 'react';
import { ViewStyle } from 'react-native';
import { VideoProperties } from 'react-native-video';
import { IMessage } from './types';
interface MessageVideoProps<TMessage extends IMessage = IMessage> {
    currentMessage?: TMessage;
    containerStyle?: ViewStyle;
    videoStyle?: ViewStyle;
    videoProps?: Partial<VideoProperties>;
    lightboxProps?: object;
}
export default class MessageVideo extends React.Component<MessageVideoProps> {
    static defaultProps: {
        currentMessage: {
            video: null;
        };
        containerStyle: {};
        videoStyle: {
            width: number;
            height: number;
            borderRadius: number;
            margin: number;
        };
        videoProps: {};
    };
    static propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        videoStyle: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        videoProps: PropTypes.Requireable<object>;
    };
    player: any;
    render(): JSX.Element;
}
export {};
