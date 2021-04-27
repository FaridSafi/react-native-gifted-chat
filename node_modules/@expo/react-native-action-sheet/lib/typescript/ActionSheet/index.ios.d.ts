import * as React from 'react';
import { ViewProps } from 'react-native';
import { ActionSheetIOSOptions } from '../types';
interface Props {
    readonly children: React.ReactNode;
    readonly pointerEvents?: ViewProps['pointerEvents'];
}
declare type onSelect = (buttonIndex: number) => void;
export default class ActionSheet extends React.Component<Props> {
    render(): JSX.Element;
    showActionSheetWithOptions(dataOptions: ActionSheetIOSOptions, onSelect: onSelect): void;
}
export {};
