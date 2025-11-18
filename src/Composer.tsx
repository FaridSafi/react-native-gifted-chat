import React, { useCallback, useRef } from 'react'
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  useColorScheme,
} from 'react-native'
import Color from './Color'
import { MIN_COMPOSER_HEIGHT } from './Constant'
import stylesCommon from './styles'

export interface ComposerProps {
  composerHeight?: number
  text?: string
  textInputProps?: Partial<TextInputProps>
  onTextChanged?(text: string): void
  onInputSizeChanged?(layout: { width: number, height: number }): void
}

export function Composer ({
  composerHeight = MIN_COMPOSER_HEIGHT,
  onInputSizeChanged,
  onTextChanged,
  text = '',
  textInputProps,
}: ComposerProps): React.ReactElement {
  const dimensionsRef = useRef<{ width: number, height: number }>(null)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const determineInputSizeChange = useCallback(
    (dimensions: { width: number, height: number }) => {
      // Support earlier versions of React Native on Android.
      if (!dimensions)
        return

      if (
        !dimensionsRef.current ||
        (dimensionsRef.current &&
          (dimensionsRef.current.width !== dimensions.width ||
            dimensionsRef.current.height !== dimensions.height))
      ) {
        dimensionsRef.current = dimensions
        onInputSizeChanged?.(dimensions)
      }
    },
    [onInputSizeChanged]
  )

  const handleContentSizeChange = useCallback(
    ({
      nativeEvent: { contentSize },
    }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) =>
      determineInputSizeChange(contentSize),
    [determineInputSizeChange]
  )

  const placeholder = textInputProps?.placeholder ?? 'Type a message...'

  return (
    <TextInput
      testID={placeholder}
      accessible
      accessibilityLabel={placeholder}
      placeholderTextColor={textInputProps?.placeholderTextColor ?? (isDark ? '#888' : Color.defaultColor)}
      onContentSizeChange={handleContentSizeChange}
      onChangeText={onTextChanged}
      value={text}
      enablesReturnKeyAutomatically
      underlineColorAndroid='transparent'
      keyboardAppearance={isDark ? 'dark' : 'default'}
      multiline
      placeholder={placeholder}
      {...textInputProps}
      style={[
        stylesCommon.fill,
        styles.textInput,
        styles[`textInput_${colorScheme}`],
        textInputProps?.style,
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
    />
  )
}

const styles = StyleSheet.create({
  textInput: {
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 22,
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
  textInput_dark: {
    color: '#fff',
  },
})
