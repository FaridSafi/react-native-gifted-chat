import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Actions } from './Actions';
import { Color } from './Color';
import { Composer } from './Composer';
import { useColorScheme } from './hooks/useColorScheme';
import { Send } from './Send';
import { getColorSchemeStyle } from './styles';
import { renderComponentOrElement } from './utils';
export function InputToolbar(props) {
    const { renderActions, onPressActionButton, renderComposer, renderSend, renderAccessory, actions, actionSheetOptionTintColor, icon, wrapperStyle, containerStyle, } = props;
    const colorScheme = useColorScheme();
    const actionsFragment = useMemo(() => {
        const actionsProps = {
            onPressActionButton,
            actions,
            actionSheetOptionTintColor,
            icon,
            wrapperStyle,
            containerStyle,
        };
        if (renderActions)
            return renderComponentOrElement(renderActions, actionsProps);
        if (onPressActionButton)
            return <Actions {...actionsProps}/>;
        return null;
    }, [
        renderActions,
        onPressActionButton,
        actions,
        actionSheetOptionTintColor,
        icon,
        wrapperStyle,
        containerStyle,
    ]);
    const composerFragment = useMemo(() => {
        const composerProps = props;
        if (renderComposer)
            return renderComponentOrElement(renderComposer, composerProps);
        return <Composer {...composerProps}/>;
    }, [renderComposer, props]);
    const sendFragment = useMemo(() => {
        if (renderSend)
            return renderComponentOrElement(renderSend, props);
        return <Send {...props}/>;
    }, [renderSend, props]);
    const accessoryFragment = useMemo(() => {
        if (!renderAccessory)
            return null;
        return renderComponentOrElement(renderAccessory, props);
    }, [renderAccessory, props]);
    return (<View style={[getColorSchemeStyle(styles, 'container', colorScheme), containerStyle]}>
      <View style={[getColorSchemeStyle(styles, 'primary', colorScheme), props.primaryStyle]}>
        {actionsFragment}
        {composerFragment}
        {sendFragment}
      </View>
      {accessoryFragment}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Color.defaultColor,
        backgroundColor: Color.white,
    },
    container_dark: {
        backgroundColor: '#1a1a1a',
        borderTopColor: '#444',
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
});
//# sourceMappingURL=InputToolbar.js.map