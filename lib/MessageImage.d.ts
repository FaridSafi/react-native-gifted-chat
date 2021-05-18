import PropTypes from 'prop-types';
import { Component } from 'react';
import { ImageProps, ViewStyle, StyleProp, ImageStyle } from 'react-native';
import { IMessage } from './Models';
export interface MessageImageProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    imageProps?: Partial<ImageProps>;
    lightboxProps?: object;
}
export default class MessageImage<TMessage extends IMessage = IMessage> extends Component<MessageImageProps<TMessage>> {
    static defaultProps: {
        currentMessage: {
            image: null;
        };
        containerStyle: {};
        imageStyle: {};
        imageProps: {};
        lightboxProps: {};
    };
    static propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Requireable<number | boolean | object>;
        imageStyle: PropTypes.Requireable<number | boolean | object>;
        imageProps: PropTypes.Requireable<object>;
        lightboxProps: PropTypes.Requireable<object>;
    };
    render(): JSX.Element | null;
}
