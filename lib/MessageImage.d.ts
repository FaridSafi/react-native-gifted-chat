import React from 'react';
import { ImageProps, ViewStyle, StyleProp, ImageStyle, ImageURISource } from 'react-native';
import { IMessage } from './Models';
export interface MessageImageProps<TMessage extends IMessage> {
    currentMessage: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    imageSourceProps?: Partial<ImageURISource>;
    imageStyle?: StyleProp<ImageStyle>;
    imageProps?: Partial<ImageProps>;
}
export declare function MessageImage<TMessage extends IMessage = IMessage>({ containerStyle, imageProps, imageSourceProps, imageStyle, currentMessage, }: MessageImageProps<TMessage>): React.JSX.Element | null;
