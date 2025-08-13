import React from 'react';
import { ViewStyle, StyleProp, TextStyle } from 'react-native';
import { IMessage } from './types';
export interface SystemMessageProps<TMessage extends IMessage> {
    currentMessage: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
}
export declare function SystemMessage<TMessage extends IMessage = IMessage>({ currentMessage, containerStyle, wrapperStyle, textStyle, children, }: SystemMessageProps<TMessage>): React.JSX.Element | null;
