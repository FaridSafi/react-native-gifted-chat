import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TouchableOpacityProps } from './components/TouchableOpacity';
import { IMessage } from './Models';
export interface SendProps<TMessage extends IMessage> {
    text?: string;
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    isSendButtonAlwaysVisible?: boolean;
    sendButtonProps?: Partial<TouchableOpacityProps>;
    onSend?(messages: Partial<TMessage> | Partial<TMessage>[], shouldResetInputToolbar: boolean): void;
}
export declare const Send: <TMessage extends IMessage = IMessage>({ text, containerStyle, children, textStyle, label, isSendButtonAlwaysVisible, sendButtonProps, onSend, }: SendProps<TMessage>) => React.JSX.Element;
