import PropTypes from 'prop-types';
import { Component } from 'react';
import { ImageProps, ViewStyle, StyleProp, ImageStyle } from 'react-native';
import { IMessage } from './types';
export interface MessageLocationProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    locationStyle?: StyleProp<ImageStyle>;
    locationProps?: Partial<ImageProps>;
    lightboxProps?: object;
}
export default class MessageLocation<TMessage extends IMessage = IMessage> extends Component<MessageLocationProps<TMessage>> {
    static defaultProps: {
        currentMessage: {
            location: null;
        };
        containerStyle: {};
        locationStyle: {};
        locationProps: {};
        lightboxProps: {};
    };
    static propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        locationStyle: PropTypes.Requireable<object>;
        locationProps: PropTypes.Requireable<object>;
        lightboxProps: PropTypes.Requireable<object>;
    };
    render(): JSX.Element | null;
}
