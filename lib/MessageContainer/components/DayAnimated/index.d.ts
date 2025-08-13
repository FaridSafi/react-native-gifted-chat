import React from 'react';
import { DayAnimatedProps } from './types';
export * from './types';
declare const DayAnimated: ({ scrolledY, daysPositions, listHeight, renderDay, messages, isLoadingEarlier, ...rest }: DayAnimatedProps) => React.JSX.Element | null;
export default DayAnimated;
