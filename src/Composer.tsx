import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  LayoutChangeEvent,
} from 'react-native'
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant'
import Color from './Color'
import { StylePropType } from './utils'
import { useCallbackOne } from 'use-memo-one'

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    ...Platform.select({
      web: {
        paddingTop: 6,
        paddingLeft: 4,
      },
    }),
    marginTop: Platform.select({
      ios: 6,
      android: 0,
      web: 6,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
      web: 4,
    }),
  },
})

export interface ComposerProps {
  composerHeight?: number
  text?: string
  placeholder?: string
  placeholderTextColor?: string
  textInputProps?: Partial<TextInputProps>
  textInputStyle?: TextInputProps['style']
  textInputAutoFocus?: boolean
  keyboardAppearance?: TextInputProps['keyboardAppearance']
  multiline?: boolean
  disableComposer?: boolean
  onTextChanged?(text: string): void
  onInputSizeChanged?(layout: { width: number; height: number }): void
}

export function Composer({
  composerHeight = MIN_COMPOSER_HEIGHT,
  disableComposer = false,
  keyboardAppearance = 'default',
  multiline = true,
  onInputSizeChanged = () => {},
  onTextChanged = () => {},
  placeholder = DEFAULT_PLACEHOLDER,
  placeholderTextColor = Color.defaultColor,
  text = '',
  textInputAutoFocus = false,
  textInputProps = {},
  textInputStyle,
}: ComposerProps): React.ReactElement {
  const layoutRef = useRef<{ width: number; height: number }>()

  const handleOnLayout = useCallbackOne(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      // Support earlier versions of React Native on Android.
      if (!layout) {
        return
      }

      if (
        !layoutRef ||
        (layoutRef.current &&
          (layoutRef.current.width !== layout.width ||
            layoutRef.current.height !== layout.height))
      ) {
        layoutRef.current = layout
        onInputSizeChanged(layout)
      }
    },
    [onInputSizeChanged],
  )

  return (
    <TextInput
      testID={placeholder}
      accessible
      accessibilityLabel={placeholder}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      multiline={multiline}
      editable={!disableComposer}
      onLayout={handleOnLayout}
      onChangeText={onTextChanged}
      style={[
        styles.textInput,
        textInputStyle,
        {
          height: composerHeight,
          ...Platform.select({
            web: {
              outlineWidth: 0,
              outlineColor: 'transparent',
              outlineOffset: 0,
            },
          }),
        },
      ]}
      autoFocus={textInputAutoFocus}
      value={text}
      enablesReturnKeyAutomatically
      underlineColorAndroid='transparent'
      keyboardAppearance={keyboardAppearance}
      {...textInputProps}
    />
  )
}

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  disableComposer: PropTypes.bool,
  textInputStyle: StylePropType,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
}
