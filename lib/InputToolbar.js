import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Composer } from './Composer';
import { Send } from './Send';
import { Actions } from './Actions';
import Color from './Color';
export function InputToolbar(props) {
    const { renderActions, onPressActionButton, renderComposer, renderSend, renderAccessory, options, optionTintColor, icon, wrapperStyle, containerStyle, } = props;
    const actionsFragment = useMemo(() => {
        const props = {
            onPressActionButton,
            options,
            optionTintColor,
            icon,
            wrapperStyle,
            containerStyle,
        };
        return (renderActions?.(props) || (onPressActionButton && <Actions {...props}/>));
    }, [
        renderActions,
        onPressActionButton,
        options,
        optionTintColor,
        icon,
        wrapperStyle,
        containerStyle,
    ]);
    const composerFragment = useMemo(() => {
        return (renderComposer?.(props) || (<Composer {...props}/>));
    }, [renderComposer, props]);
    return (<View style={[styles.container, containerStyle]}>
      <View style={[styles.primary, props.primaryStyle]}>
        {actionsFragment}
        {composerFragment}
        {renderSend?.(props) || <Send {...props}/>}
      </View>
      {renderAccessory && (<View style={[styles.accessory, props.accessoryStyle]}>
          {renderAccessory(props)}
        </View>)}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Color.defaultColor,
        backgroundColor: Color.white,
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    accessory: {
        height: 44,
    },
});
//# sourceMappingURL=InputToolbar.js.map