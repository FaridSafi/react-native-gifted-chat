import React from 'react'
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
} from 'react-native'
import { Color } from './Color'
import stylesCommon, { getColorSchemeStyle } from './styles'

export interface ComposerProps {
  composerHeight?: number
  text?: string
  textInputProps?: Partial<TextInputProps>
}

export function Composer ({
  text = '',
  textInputProps,
}: ComposerProps): React.ReactElement {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const placeholder = textInputProps?.placeholder ?? 'Type a message...'

  return (
    <View style={stylesCommon.fill}>
      <TextInput
        testID={placeholder}
        accessible
        accessibilityLabel={placeholder}
        placeholderTextColor={textInputProps?.placeholderTextColor ?? (isDark ? '#888' : Color.defaultColor)}
        value={text}
        enablesReturnKeyAutomatically
        underlineColorAndroid='transparent'
        keyboardAppearance={isDark ? 'dark' : 'default'}
        multiline
        placeholder={placeholder}
        {...textInputProps}
        style={getColorSchemeStyle(styles, 'textInput', colorScheme)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    lineHeight: 22,
    paddingTop: 8,
    paddingBottom: 10,
  },
  textInput_dark: {
    color: '#fff',
  },
})
