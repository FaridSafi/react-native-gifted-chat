import React from 'react';
import { IMessage } from '../Models';
import { GiftedChatProps } from './types';
declare function GiftedChatWrapper<TMessage extends IMessage = IMessage>(props: GiftedChatProps<TMessage>): React.JSX.Element;
declare namespace GiftedChatWrapper {
    var append: <TMessage extends IMessage>(currentMessages: TMessage[] | undefined, messages: TMessage[], isInverted?: boolean) => TMessage[];
    var prepend: <TMessage extends IMessage>(currentMessages: TMessage[] | undefined, messages: TMessage[], isInverted?: boolean) => TMessage[];
}
export { GiftedChatWrapper as GiftedChat };
