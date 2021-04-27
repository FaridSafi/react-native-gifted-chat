import * as Font from "expo-font";
import React from "react";
import { Text } from "react-native";
import createIconSet from "./vendor/react-native-vector-icons/lib/create-icon-set";
import createIconButtonComponent from "./vendor/react-native-vector-icons/lib/icon-button";
export { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from "./vendor/react-native-vector-icons/lib/create-icon-set";
export default function (glyphMap, fontName, expoAssetId, fontStyle) {
    var _a;
    const font = { [fontName]: expoAssetId };
    const RNVIconComponent = createIconSet(glyphMap, fontName, null, fontStyle);
    return _a = class Icon extends React.Component {
            constructor() {
                super(...arguments);
                this._mounted = false;
                this.state = {
                    fontIsLoaded: Font.isLoaded(fontName)
                };
            }
            async componentDidMount() {
                this._mounted = true;
                if (!this.state.fontIsLoaded) {
                    await Font.loadAsync(font);
                    this._mounted && this.setState({ fontIsLoaded: true });
                }
            }
            componentWillUnmount() {
                this._mounted = false;
            }
            setNativeProps(props) {
                if (this._icon) {
                    this._icon.setNativeProps(props);
                }
            }
            render() {
                if (!this.state.fontIsLoaded) {
                    return <Text />;
                }
                return (<RNVIconComponent ref={view => {
                    this._icon = view;
                }} {...this.props}/>);
            }
        },
        _a.propTypes = RNVIconComponent.propTypes,
        _a.defaultProps = RNVIconComponent.defaultProps,
        _a.Button = createIconButtonComponent(_a),
        _a.glyphMap = glyphMap,
        _a.getRawGlyphMap = () => glyphMap,
        _a.getFontFamily = () => fontName,
        _a.loadFont = () => Font.loadAsync(font),
        _a.font = font,
        _a;
}
//# sourceMappingURL=createIconSet.js.map