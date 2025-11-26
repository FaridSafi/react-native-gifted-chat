import React from 'react';
import { IMessage } from '../Models';
import { MessagesContainerProps } from './types';
export * from './types';
export declare const MessagesContainer: <TMessage extends IMessage>(props: MessagesContainerProps<TMessage>) => React.JSX.Element;
