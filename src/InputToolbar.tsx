import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'

import { Composer, ComposerProps } from './Composer'
import { Send, SendProps } from './Send'
import { Actions, ActionsProps } from './Actions'
import Color from './Color'
import { StylePropType } from './utils'
import { IMessage } from './Models'

export interface InputToolbarProps<TMessage extends IMessage> {
  options?: { [key: string]: any }
  optionTintColor?: string
  containerStyle?: StyleProp<ViewStyle>
  primaryStyle?: StyleProp<ViewStyle>
  accessoryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode
  renderActions?(props: ActionsProps): React.ReactNode
  renderSend?(props: SendProps<TMessage>): React.ReactNode
  renderComposer?(props: ComposerProps): React.ReactNode
  onPressActionButton?(): void
}

export function InputToolbar<TMessage extends IMessage = IMessage> (
  props: InputToolbarProps<TMessage>
) {
  const { containerStyle, ...rest } = props
  const {
    renderActions,
    onPressActionButton,
    renderComposer,
    renderSend,
    renderAccessory,
  } = rest

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.primary, props.primaryStyle]}>
        {renderActions?.(rest) ||
          (onPressActionButton && <Actions {...rest} />)}
        {renderComposer?.(props as ComposerProps) || <Composer {...props} />}
        {renderSend?.(props) || <Send {...props} />}
      </View>
      {renderAccessory && (
        <View style={[styles.accessory, props.accessoryStyle]}>
          {renderAccessory(props)}
        </View>
      )}
    </View>
  )
}

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: StylePropType,
  primaryStyle: StylePropType,
  accessoryStyle: StylePropType,
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
})
