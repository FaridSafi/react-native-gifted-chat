import React from 'react';
import { IMessage } from '../types';
import { MessageContainerProps } from './types';
export * from './types';
declare function MessageContainer<TMessage extends IMessage = IMessage>(props: MessageContainerProps<TMessage>): React.JSX.Element;
export default MessageContainer;
