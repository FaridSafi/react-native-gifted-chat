import PropTypes from 'prop-types'
import React from 'react'
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
} from 'react-native'
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant'
import Color from './Color'
import { StylePropType } from './utils'
import { useChatContext } from './GiftedChatContext'

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    paddingTop: 8,
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
}

export function Composer({
  disableComposer = false,
  keyboardAppearance = 'default',
  multiline = true,
  onTextChanged = () => {},
  placeholder = DEFAULT_PLACEHOLDER,
  placeholderTextColor = Color.defaultColor,
  text = '',
  textInputAutoFocus = false,
  textInputProps = {},
  textInputStyle,
}: ComposerProps): React.ReactElement {
  const chatContext = useChatContext()
  const [composerHeight, setComposerHeight] = React.useState(chatContext.minComposerHeight)

  return (
    <TextInput
      testID={placeholder}
      accessible
      accessibilityLabel={placeholder}
      onContentSizeChange={(e) => {
        const min = Math.min(e.nativeEvent.contentSize.height, 100)
        const max = Math.max(min, chatContext.minComposerHeight)
        setComposerHeight(max)
      }}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      multiline={multiline}
      editable={!disableComposer}
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
