import { ActionSheetOptions } from '@expo/react-native-action-sheet';
export interface IGiftedChatContext {
    actionSheet(): {
        showActionSheetWithOptions: (options: ActionSheetOptions, callback: (buttonIndex?: number) => void | Promise<void>) => void;
    };
    getLocale(): string;
}
export declare const GiftedChatContext: import("react").Context<IGiftedChatContext>;
export declare const useChatContext: () => IGiftedChatContext;
