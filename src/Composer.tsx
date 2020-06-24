import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { Platform, StyleSheet, TextInput, TextInputProps } from 'react-native'
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
  onInputSizeChanged?(contentSize: { width: number; height: number }): void
}

export function Composer(props: ComposerProps): React.ReactElement {
  const { placeholder, onTextChanged, text } = props
  const contentSizeRef = useRef<{ width: number; height: number }>()

  const onContentSizeChange = useCallbackOne(
    (event: any) => {
      const { contentSize } = event.nativeEvent

      // Support earlier versions of React Native on Android.
      if (!contentSize) {
        return
      }

      const { current: currentContent } = contentSizeRef
      const contentHasChange =
        currentContent?.width !== contentSize.width ||
        currentContent?.height !== contentSize.height

      if (contentHasChange) {
        contentSizeRef.current = contentSize
        props.onInputSizeChanged!(contentSize!)
      }
    },
    [props.onInputSizeChanged],
  )

  return (
    <TextInput
      testID={placeholder}
      accessible
      accessibilityLabel={placeholder}
      placeholder={placeholder}
      placeholderTextColor={props.placeholderTextColor}
      multiline={props.multiline}
      editable={!props.disableComposer}
      onChange={onContentSizeChange}
      onContentSizeChange={onContentSizeChange}
      onChangeText={onTextChanged}
      style={[
        styles.textInput,
        props.textInputStyle,
        {
          height: props.composerHeight,
          ...Platform.select({
            web: {
              outlineWidth: 0,
              outlineColor: 'transparent',
              outlineOffset: 0,
            },
          }),
        },
      ]}
      autoFocus={props.textInputAutoFocus}
      value={text}
      enablesReturnKeyAutomatically
      underlineColorAndroid='transparent'
      keyboardAppearance={props.keyboardAppearance}
      {...props.textInputProps}
    />
  )
}

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: '',
  placeholderTextColor: Color.defaultColor,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  disableComposer: false,
  textInputStyle: {},
  textInputAutoFocus: false,
  keyboardAppearance: 'default',
  onTextChanged: () => {},
  onInputSizeChanged: () => {},
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
