declare type FontStyle = {
    fontFamily: string;
    fontFile: any;
    glyphMap: any;
    fontStyle: any;
};
declare type FontStyles = {
    [key: string]: FontStyle;
};
export default function createMultiStyleIconSet(styles: FontStyles, optionsInput?: {}): any;
export {};
