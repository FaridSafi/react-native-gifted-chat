import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'

import { Composer, ComposerProps } from './Composer'
import { Send, SendProps } from './Send'
import { Actions, ActionsProps } from './Actions'
import Color from './Color'
import { StylePropType } from './utils'
import { IMessage } from './Models'

export interface InputToolbarProps<TMessage extends IMessage> {
  options?: { [key: string]: () => void }
  optionTintColor?: string
  containerStyle?: StyleProp<ViewStyle>
  primaryStyle?: StyleProp<ViewStyle>
  accessoryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode
  renderActions?(props: ActionsProps): React.ReactNode
  renderSend?(props: SendProps<TMessage>): React.ReactNode
  renderComposer?(props: ComposerProps): React.ReactNode
  onPressActionButton?(): void
  icon?: () => React.ReactNode
  wrapperStyle?: StyleProp<ViewStyle>
}

export function InputToolbar<TMessage extends IMessage = IMessage> (
  props: InputToolbarProps<TMessage>
) {
  const {
    renderActions,
    onPressActionButton,
    renderComposer,
    renderSend,
    renderAccessory,
    options,
    optionTintColor,
    icon,
    wrapperStyle,
    containerStyle,
  } = props

  const actionsFragment = useMemo(() => {
    const props = {
      options,
      optionTintColor,
      icon,
      wrapperStyle,
      containerStyle,
    }

    return (
      renderActions?.(props) || (onPressActionButton && <Actions {...props} />)
    )
  }, [
    renderActions,
    onPressActionButton,
    options,
    optionTintColor,
    icon,
    wrapperStyle,
    containerStyle,
  ])

  const composerFragment = useMemo(() => {
    return (
      renderComposer?.(props as ComposerProps) || (
        <Composer {...(props as ComposerProps)} />
      )
    )
  }, [renderComposer, props])

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.primary, props.primaryStyle]}>
        {actionsFragment}
        {composerFragment}
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
