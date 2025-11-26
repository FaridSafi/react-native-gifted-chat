import { StyleProp, TextStyle, ViewStyle } from 'react-native';
declare const _default: {
    fill: {
        flex: number;
    };
    centerItems: {
        justifyContent: "center";
        alignItems: "center";
    };
};
export default _default;
export declare function getColorSchemeStyle<T>(styles: T, baseName: string, colorScheme?: string | null): T[keyof T][];
export declare function getStyleWithPosition<T>(styles: T, baseName: string, position?: 'left' | 'right' | null): StyleProp<ViewStyle> | StyleProp<TextStyle>;
