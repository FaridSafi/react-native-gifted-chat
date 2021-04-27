import * as React from 'react';
import { TouchableNativeFeedback, TouchableWithoutFeedbackProps } from 'react-native';
declare type Props = TouchableWithoutFeedbackProps & {
    pressInDelay: number;
    background: any;
};
export default class TouchableNativeFeedbackSafe extends React.Component<Props> {
    static SelectableBackground: (() => {}) | typeof TouchableNativeFeedback.SelectableBackground;
    static SelectableBackgroundBorderless: (() => {}) | typeof TouchableNativeFeedback.SelectableBackgroundBorderless;
    static Ripple: ((color: string, borderless?: boolean | undefined) => {}) | typeof TouchableNativeFeedback.Ripple;
    render(): JSX.Element;
}
export {};
