import React from 'react';
import { IMessage } from '../Models';
import { MessageProps } from './types';
export * from './types';
export declare const Message: <TMessage extends IMessage = IMessage>(props: MessageProps<TMessage>) => React.JSX.Element | null;
