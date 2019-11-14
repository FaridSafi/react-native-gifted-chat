import PropTypes from 'prop-types';
import { Component } from 'react';
import { ImageProps, ViewStyle, StyleProp, ImageStyle } from 'react-native';
import { IMessage } from 'react-native-gifted-chat/lib/types';
export interface MessageDocumentProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    documentStyle?: StyleProp<ImageStyle>;
    documentProps?: Partial<ImageProps>;
    lightboxProps?: object;
}
export default class MessageDocument<TMessage extends IMessage = IMessage> extends Component<MessageDocumentProps<TMessage>> {
    static defaultProps: {
        currentMessage: {
            document: null;
        };
        containerStyle: {};
        documentStyle: {};
        documentProps: {};
        lightboxProps: {};
    };
    static propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        documentStyle: PropTypes.Requireable<object>;
        documentProps: PropTypes.Requireable<object>;
        lightboxProps: PropTypes.Requireable<object>;
    };
    render(): JSX.Element | null;
}
