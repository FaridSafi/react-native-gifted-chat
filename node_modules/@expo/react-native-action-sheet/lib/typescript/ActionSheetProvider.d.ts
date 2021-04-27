import * as React from 'react';
import ActionSheet from './ActionSheet';
import { ActionSheetOptions } from './types';
interface Props {
    children: React.ReactNode;
}
export default class ActionSheetProvider extends React.Component<Props> {
    _actionSheetRef: React.RefObject<ActionSheet>;
    constructor(props: Props);
    getContext: () => {
        showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i: number) => void) => void;
    };
    render(): JSX.Element;
}
export {};
