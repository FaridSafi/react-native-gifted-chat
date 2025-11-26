import React from 'react';
import { IMessage } from './Models';
export declare function renderComponentOrElement<TProps extends Record<string, any>>(component: React.ComponentType<TProps> | React.ReactElement | ((props: TProps) => React.ReactNode) | null | undefined, props: TProps): React.ReactNode;
export declare function isSameDay(currentMessage: IMessage, diffMessage: IMessage | null | undefined): boolean;
export declare function isSameUser(currentMessage: IMessage, diffMessage: IMessage | null | undefined): boolean;
export declare function useCallbackDebounced<T extends (...args: any[]) => any>(callbackFunc: T, deps: React.DependencyList | undefined, time: number): (...args: Parameters<T>) => void;
export declare function useCallbackThrottled<T extends (...args: any[]) => any>(callbackFunc: T, deps: React.DependencyList | undefined, time: number): (...args: Parameters<T>) => void;
