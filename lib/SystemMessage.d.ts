import React from 'react';
import { ViewStyle, StyleProp, TextStyle } from 'react-native';
import { MessageTextProps } from './MessageText';
import { IMessage } from './Models';
export interface SystemMessageProps<TMessage extends IMessage> {
    currentMessage: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    messageContainerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    messageTextProps?: Partial<MessageTextProps<TMessage>>;
    children?: React.ReactNode;
}
export declare function SystemMessage<TMessage extends IMessage>({ currentMessage, containerStyle, messageContainerStyle, textStyle, messageTextProps, children, }: SystemMessageProps<TMessage>): React.JSX.Element | null;
