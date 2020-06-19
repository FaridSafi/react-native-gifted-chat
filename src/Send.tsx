import * as React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native'
import { useCallbackOne, useMemoOne } from 'use-memo-one'

import Color from './Color'
import { IMessage } from './Models'
import { StylePropType } from './utils'

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
})

export interface SendProps<TMessage extends IMessage> {
  text?: string
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
  alwaysShowSend?: boolean
  disabled?: boolean
  sendButtonProps?: Partial<TouchableOpacityProps>
  onSend?(
    messages: Partial<TMessage> | Partial<TMessage>[],
    shouldResetInputToolbar: boolean,
  ): void
}

export const Send = <TMessage extends IMessage = IMessage>({
  text,
  containerStyle,
  children,
  textStyle,
  label,
  alwaysShowSend,
  disabled,
  sendButtonProps,
  onSend,
}: SendProps<TMessage>) => {
  const handleOnPress = useCallbackOne(() => {
    if (text && onSend) {
      onSend({ text: text.trim() } as Partial<TMessage>, true)
    }
  }, [text, onSend])

  const showSend = useMemoOne(
    () => alwaysShowSend || (text && text.trim().length > 0),
    [alwaysShowSend, text],
  )

  if (showSend) {
    return (
      <TouchableOpacity
        testID='send'
        accessible
        accessibilityLabel='send'
        style={[styles.container, containerStyle]}
        onPress={handleOnPress}
        accessibilityTraits='button'
        disabled={disabled}
        {...sendButtonProps}
      >
        <View>
          {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
        </View>
      </TouchableOpacity>
    )
  }
  return <View />
}

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
  children: null,
  alwaysShowSend: false,
  disabled: false,
  sendButtonProps: null,
}

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: StylePropType,
  textStyle: StylePropType,
  children: PropTypes.element,
  alwaysShowSend: PropTypes.bool,
  disabled: PropTypes.bool,
  sendButtonProps: PropTypes.object,
}
