import * as React from 'react';
import { ViewProps } from 'react-native';
import { ActionSheetOptions } from '../types';
interface State {
    isVisible: boolean;
    isAnimating: boolean;
    options: ActionSheetOptions | null;
    onSelect: ((i: number) => void) | null;
    overlayOpacity: any;
    sheetOpacity: any;
}
interface Props {
    readonly useNativeDriver: boolean | undefined;
    readonly pointerEvents?: ViewProps['pointerEvents'];
}
export default class ActionSheet extends React.Component<Props, State> {
    static defaultProps: {
        useNativeDriver: boolean;
    };
    _actionSheetHeight: number;
    state: State;
    _deferNextShow?: () => void;
    _setActionSheetHeight: ({ nativeEvent }: any) => any;
    render(): JSX.Element;
    _renderSheet(): JSX.Element | null;
    showActionSheetWithOptions: (options: ActionSheetOptions, onSelect: (i: number) => void) => void;
    _selectCancelButton: () => boolean | undefined;
    _onSelect: (index: number) => boolean;
    _animateOut: () => boolean;
}
export {};
