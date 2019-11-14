import PropTypes from 'prop-types';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { VideoProperties } from 'react-native-video';
import { IMessage } from './types';
export interface MessageVideoProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    videoStyle?: StyleProp<ViewStyle>;
    videoProps?: Partial<VideoProperties>;
    lightboxProps?: object;
}
export default class MessageVideo<TMessage extends IMessage = IMessage> extends React.Component<MessageVideoProps<TMessage>> {
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
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        videoStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        videoProps: PropTypes.Requireable<object>;
    };
    player: any;
    render(): JSX.Element;
}
