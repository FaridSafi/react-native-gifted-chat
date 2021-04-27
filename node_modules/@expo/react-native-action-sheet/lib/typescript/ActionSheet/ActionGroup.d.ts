import * as React from 'react';
import { ActionSheetOptions } from '../types';
declare type Props = ActionSheetOptions & {
    tintIcons: boolean | null;
    onSelect: (i: number) => boolean;
    startIndex: number;
    length: number;
};
export default class ActionGroup extends React.Component<Props> {
    static defaultProps: {
        title: null;
        message: null;
        showSeparators: boolean;
        tintIcons: boolean;
        textStyle: {};
    };
    render(): JSX.Element;
    _renderRowSeparator: (key: string | number) => JSX.Element;
    _renderTitleContent: () => JSX.Element | null;
    _renderIconElement: (iconSource: React.ReactNode, color: string) => JSX.Element | null;
    _renderOptionViews: () => React.ReactNode[];
}
export {};
