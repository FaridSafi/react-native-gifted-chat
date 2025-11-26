import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    fill: {
        flex: 1,
    },
    centerItems: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export function getColorSchemeStyle(styles, baseName, colorScheme) {
    const key = `${baseName}_${colorScheme}`;
    return [styles[baseName], styles[key]];
}
export function getStyleWithPosition(styles, baseName, position) {
    const stylesArray = [styles[baseName]];
    if (position) {
        const key = `${baseName}_${position}`;
        stylesArray.push(styles[key]);
    }
    return StyleSheet.flatten(stylesArray);
}
//# sourceMappingURL=styles.js.map