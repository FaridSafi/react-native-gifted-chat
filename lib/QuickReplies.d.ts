import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { IMessage, Reply } from './types';
export interface QuickRepliesProps<TMessage extends IMessage = IMessage> {
    nextMessage?: TMessage;
    currentMessage: TMessage;
    color?: string;
    sendText?: string;
    quickReplyStyle?: StyleProp<ViewStyle>;
    quickReplyTextStyle?: StyleProp<TextStyle>;
    quickReplyContainerStyle?: StyleProp<ViewStyle>;
    onQuickReply?(reply: Reply[]): void;
    renderQuickReplySend?(): React.ReactNode;
}
export declare function QuickReplies({ currentMessage, nextMessage, color, quickReplyStyle, quickReplyTextStyle, quickReplyContainerStyle, onQuickReply, sendText, renderQuickReplySend, }: QuickRepliesProps<IMessage>): React.JSX.Element | null;
