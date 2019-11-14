import PropTypes from 'prop-types';
import { Component } from 'react';
import { ImageProps, ViewStyle, StyleProp, ImageStyle } from 'react-native';
import { IMessage } from 'react-native-gifted-chat/lib/types';
export interface MessageContactProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    contactStyle?: StyleProp<ImageStyle>;
    contactProps?: Partial<ImageProps>;
    lightboxProps?: object;
}
export default class MessageContact<TMessage extends IMessage = IMessage> extends Component<MessageContactProps<TMessage>> {
    static defaultProps: {
        currentMessage: {
            contact: null;
        };
        containerStyle: {};
        contactStyle: {};
        contactProps: {};
        lightboxProps: {};
    };
    static propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        contactStyle: PropTypes.Requireable<object>;
        contactProps: PropTypes.Requireable<object>;
        lightboxProps: PropTypes.Requireable<object>;
    };
    render(): JSX.Element | null;
}
