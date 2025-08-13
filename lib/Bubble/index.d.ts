import { JSX } from 'react';
import { IMessage } from '../types';
import { BubbleProps } from './types';
export * from './types';
declare const Bubble: <TMessage extends IMessage = IMessage>(props: BubbleProps<TMessage>) => JSX.Element;
export default Bubble;
