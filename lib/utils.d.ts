import { IMessage } from './types';
export declare function isSameDay(currentMessage: IMessage, diffMessage: IMessage | null | undefined): boolean;
export declare function isSameUser(currentMessage: IMessage, diffMessage: IMessage | null | undefined): boolean;
export declare const warning: (...args: any) => void;
export declare const error: (...args: any) => void;
