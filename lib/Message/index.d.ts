import React from 'react';
import { IMessage } from '../types';
import { MessageProps } from './types';
export * from './types';
declare let Message: React.FC<MessageProps<IMessage>>;
export default Message;
