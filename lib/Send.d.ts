import React from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { IMessage } from './types';
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
export declare const Send: <TMessage extends IMessage = IMessage>({ text, containerStyle, children, textStyle, label, alwaysShowSend, disabled, sendButtonProps, onSend, }: SendProps<TMessage>) => React.JSX.Element | null;
