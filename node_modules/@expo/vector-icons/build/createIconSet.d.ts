import React, { ComponentClass } from "react";
import { TextProps, TouchableHighlightProps, ViewProps } from "react-native";
export { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from "./vendor/react-native-vector-icons/lib/create-icon-set";
export interface IconButtonProps<GLYPHS extends string> extends ViewProps, TouchableHighlightProps {
    /**
     * Size of the icon, can also be passed as fontSize in the style object.
     *
     * @default 12
     */
    size?: number;
    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://expo.github.io/vector-icons/}
     */
    name: GLYPHS;
    /**
     * Color of the icon
     *
     */
    color?: string;
}
export interface IconProps<GLYPHS extends string> extends TextProps {
    /**
     * Size of the icon, can also be passed as fontSize in the style object.
     *
     * @default 12
     */
    size?: number;
    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://expo.github.io/vector-icons/}
     */
    name: GLYPHS;
    /**
     * Color of the icon
     *
     */
    color?: string;
}
export declare type GlyphMap<G extends string> = {
    [K in G]: number;
};
export interface Icon<G extends string, FN extends string> {
    propTypes: any;
    defaultProps: any;
    Button: ComponentClass<IconButtonProps<G>>;
    glyphMap: GlyphMap<G>;
    getRawGlyphMap: () => GlyphMap<G>;
    getFontFamily: () => FN;
    loadFont: () => Promise<void>;
    font: {
        [x: string]: any;
    };
    new (props: IconProps<G>): React.Component<IconProps<G>>;
}
export default function <G extends string, FN extends string>(glyphMap: GlyphMap<G>, fontName: FN, expoAssetId: any, fontStyle?: any): Icon<G, FN>;
