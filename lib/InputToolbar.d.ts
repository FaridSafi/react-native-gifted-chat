import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ActionsProps } from './Actions';
import { ComposerProps } from './Composer';
import { IMessage } from './Models';
import { SendProps } from './Send';
export interface InputToolbarProps<TMessage extends IMessage> {
    actions?: Array<{
        title: string;
        action: () => void;
    }>;
    actionSheetOptionTintColor?: string;
    containerStyle?: StyleProp<ViewStyle>;
    primaryStyle?: StyleProp<ViewStyle>;
    renderAccessory?: (props: InputToolbarProps<TMessage>) => React.ReactNode;
    renderActions?: (props: ActionsProps) => React.ReactNode;
    renderSend?: (props: SendProps<TMessage>) => React.ReactNode;
    renderComposer?: (props: ComposerProps) => React.ReactNode;
    onPressActionButton?: () => void;
    icon?: () => React.ReactNode;
    wrapperStyle?: StyleProp<ViewStyle>;
}
export declare function InputToolbar<TMessage extends IMessage = IMessage>(props: InputToolbarProps<TMessage>): React.JSX.Element;
