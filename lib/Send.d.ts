import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { IMessage } from './Models';
export interface SendProps<TMessage extends IMessage> {
    text?: string;
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    alwaysShowSend?: boolean;
    disabled?: boolean;
    sendButtonProps?: Partial<TouchableOpacityProps>;
    onSend?(messages: Partial<TMessage> | Partial<TMessage>[], shouldResetInputToolbar: boolean): void;
}
export default class Send<TMessage extends IMessage = IMessage> extends Component<SendProps<TMessage>> {
    static defaultProps: {
        text: string;
        onSend: () => void;
        label: string;
        containerStyle: {};
        textStyle: {};
        children: null;
        alwaysShowSend: boolean;
        disabled: boolean;
        sendButtonProps: null;
    };
    static propTypes: {
        text: PropTypes.Requireable<string>;
        onSend: PropTypes.Requireable<(...args: any[]) => any>;
        label: PropTypes.Requireable<string>;
        containerStyle: PropTypes.Requireable<number | boolean | object>;
        textStyle: PropTypes.Requireable<number | boolean | object>;
        children: PropTypes.Requireable<PropTypes.ReactElementLike>;
        alwaysShowSend: PropTypes.Requireable<boolean>;
        disabled: PropTypes.Requireable<boolean>;
        sendButtonProps: PropTypes.Requireable<object>;
    };
    handleOnPress: () => void;
    render(): JSX.Element;
}
