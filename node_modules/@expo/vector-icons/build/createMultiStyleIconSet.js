import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createIconSet from './createIconSet';
export default function createMultiStyleIconSet(styles, optionsInput = {}) {
    const styleNames = Object.keys(styles);
    if (styleNames.length === 0) {
        throw new Error('You need to add at least one style');
    }
    const options = {
        defaultStyle: styleNames[0],
        fallbackFamily: (_unused) => styleNames[0],
        glyphValidator: (_unused, __unused) => true,
        ...optionsInput,
    };
    const iconSets = styleNames.reduce((acc, name) => {
        const style = styles[name];
        acc[name] = createIconSet(style.glyphMap || {}, style.fontFamily || '', style.fontFile || '', style.fontStyle || {});
        return acc;
    }, {});
    function styleFromProps(props) {
        return Object.keys(props).reduce((result, propName) => styleNames.indexOf(propName) !== -1 && props[propName] === true
            ? propName
            : result, options.defaultStyle);
    }
    function getIconSetForProps(props) {
        const { name } = props;
        const style = styleFromProps(props);
        if (options.glyphValidator(name, style))
            return iconSets[style];
        const family = options.fallbackFamily(name);
        if (styleNames.indexOf(family) === -1) {
            return options.defaultStyle;
        }
        return iconSets[family];
    }
    function selectIconClass(iconSet, iconClass) {
        return iconClass.length > 0 ? iconSet[iconClass] : iconSet;
    }
    function reduceProps(props) {
        return Object.keys(props).reduce((acc, prop) => {
            if (styleNames.indexOf(prop) === -1) {
                acc[prop] = props[prop];
            }
            return acc;
        }, {});
    }
    function getStyledIconSet(style, name = '') {
        if (styleNames.indexOf(style) === -1) {
            return iconSets[options.defaultStyle];
        }
        return !name
            ? iconSets[styleFromProps({ [style]: true })]
            : getIconSetForProps({ name, [style]: true });
    }
    function getFontFamily(style = options.defaultStyle) {
        return getStyledIconSet(style).getFontFamily();
    }
    function getRawGlyphMap(style = options.defaultStyle) {
        return getStyledIconSet(style).getRawGlyphMap();
    }
    function hasIcon(name, style = options.defaultStyle) {
        return options.glyphValidator(name, style);
    }
    function createStyledIconClass(selectClass = '') {
        class IconClass extends PureComponent {
            render() {
                const selectedIconSet = getIconSetForProps(this.props);
                const SelectedIconClass = selectIconClass(selectedIconSet, selectClass);
                const props = reduceProps(this.props);
                return React.createElement(SelectedIconClass, props);
            }
        }
        IconClass.propTypes = styleNames.reduce((acc, name) => {
            acc[name] = PropTypes.bool;
            return acc;
        }, {});
        IconClass.defaultProps = styleNames.reduce((acc, name) => {
            acc[name] = false;
            return acc;
        }, {});
        IconClass.font = Object.values(styles).reduce((acc, style) => {
            acc[style.fontFamily] = style.fontFile;
            return acc;
        }, {});
        IconClass.StyledIconSet = getStyledIconSet;
        IconClass.getFontFamily = getFontFamily;
        IconClass.getRawGlyphMap = getRawGlyphMap;
        IconClass.hasIcon = hasIcon;
        return IconClass;
    }
    const Icon = createStyledIconClass();
    Icon.Button = createStyledIconClass('Button');
    return Icon;
}
//# sourceMappingURL=createMultiStyleIconSet.js.map