import React from 'react';
import { IMessage } from '../../../types';
import { DaysPositions } from '../../types';
import { ItemProps } from './types';
export * from './types';
export declare const useAbsoluteScrolledPositionToBottomOfDay: (listHeight: {
    value: number;
}, scrolledY: {
    value: number;
}, containerHeight: {
    value: number;
}, dayBottomMargin: number, dayTopOffset: number) => import("react-native-reanimated").DerivedValue<number>;
export declare const useRelativeScrolledPositionToBottomOfDay: (listHeight: {
    value: number;
}, scrolledY: {
    value: number;
}, daysPositions: {
    value: DaysPositions;
}, containerHeight: {
    value: number;
}, dayBottomMargin: number, dayTopOffset: number, createdAt?: number) => import("react-native-reanimated").DerivedValue<number>;
declare const Item: <TMessage extends IMessage>(props: ItemProps<TMessage>) => React.JSX.Element;
export default Item;
