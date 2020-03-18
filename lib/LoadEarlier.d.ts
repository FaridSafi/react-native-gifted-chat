import PropTypes from 'prop-types';
import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
export interface LoadEarlierProps {
    isLoadingEarlier?: boolean;
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    activityIndicatorStyle?: StyleProp<ViewStyle>;
    activityIndicatorColor?: string;
    activityIndicatorSize?: number | 'small' | 'large';
    onLoadEarlier?(): void;
}
export default class LoadEarlier extends React.Component<LoadEarlierProps> {
    static defaultProps: {
        onLoadEarlier: () => void;
        isLoadingEarlier: boolean;
        label: string;
        containerStyle: {};
        wrapperStyle: {};
        textStyle: {};
        activityIndicatorStyle: {};
        activityIndicatorColor: string;
        activityIndicatorSize: string;
    };
    static propTypes: {
        onLoadEarlier: PropTypes.Requireable<(...args: any[]) => any>;
        isLoadingEarlier: PropTypes.Requireable<boolean>;
        label: PropTypes.Requireable<string>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        wrapperStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        textStyle: PropTypes.Requireable<any>;
        activityIndicatorStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        activityIndicatorColor: PropTypes.Requireable<string>;
        activityIndicatorSize: PropTypes.Requireable<string>;
    };
    renderLoading(): JSX.Element;
    render(): JSX.Element;
}
