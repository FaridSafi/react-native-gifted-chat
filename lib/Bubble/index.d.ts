import React from 'react';
import { IMessage } from '../Models';
import { BubbleProps } from './types';
export * from './types';
export declare const Bubble: <TMessage extends IMessage = IMessage>(props: BubbleProps<TMessage>) => React.ReactElement;
