import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Keyboard,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { Composer, ComposerProps } from './Composer'
import { Send, SendProps } from './Send'
import { Actions, ActionsProps } from './Actions'
import Color from './Color'
import { StylePropType } from './utils'
import { IMessage } from './Models'
import { useCallbackOne } from 'use-memo-one'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
})

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

export function InputToolbar<TMessage extends IMessage = IMessage>(props: InputToolbarProps<TMessage>) {
  const [position, setPosition] = useState('absolute');

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => setPosition('relative'));
    return () => keyboardWillShowListener?.remove();
  }, []);

  useEffect(() => {
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => setPosition('absolute'));
    return () => keyboardWillHideListener?.remove();
  }, []);

  const renderActions = useCallbackOne(() => {
    const { containerStyle, ...rest } = props
    if (props.renderActions) {
      return props.renderActions(rest)
    } else if (props.onPressActionButton) {
      return <Actions {...rest} />
    }

    return null
  }, [props.renderActions, props.onPressActionButton]);

  const renderSend = useCallbackOne(() => {
    if (props.renderSend) {
      return props.renderSend(props)
    }

    return <Send {...props} />
  }, [props.renderSend]);

  const renderComposer = useCallbackOne(() => {
    if (props.renderComposer) {
      return props.renderComposer(props as ComposerProps)
    }

    return <Composer {...props} />
  }, [props.renderComposer]);

  const renderAccessory = useCallbackOne(() => {
    if (props.renderAccessory) {
      return (
        <View style={[styles.accessory, props.accessoryStyle]}>
          {props.renderAccessory(props)}
        </View>
      )
    }

    return null
  }, [props.renderAccessory]);

  return (
    <View
      style={
        [
          styles.container,
          { position },
          props.containerStyle,
        ] as ViewStyle
      }
    >
      <View style={[styles.primary, props.primaryStyle]}>
        {renderActions()}
        {renderComposer()}
        {renderSend()}
      </View>
      {renderAccessory()}
    </View>
  )
}

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => { },
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
