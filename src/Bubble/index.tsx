import React from 'react'
import {
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { GiftedChatContext } from '../GiftedChatContext'
import { QuickReplies } from '../QuickReplies'
import { MessageText } from '../MessageText'
import { MessageImage } from '../MessageImage'
import { MessageVideo } from '../MessageVideo'
import { MessageAudio } from '../MessageAudio'
import { Time } from '../Time'

import { isSameUser, isSameDay } from '../utils'
import { IMessage } from '../types'
import { BubbleProps } from './types'

import stylesCommon from '../styles'
import styles from './styles'

export * from './types'

export default class Bubble<
  TMessage extends IMessage = IMessage,
> extends React.Component<BubbleProps<TMessage>> {
  static contextType = GiftedChatContext

  onPress = () => {
    if (this.props.onPress)
      this.props.onPress(this.context, this.props.currentMessage)
  }

  onLongPress = () => {
    const {
      currentMessage,
      onLongPress,
      optionTitles,
    } = this.props

    if (onLongPress) {
      onLongPress(this.context, currentMessage)
      return
    }

    if (!optionTitles?.length)
      return

    const options = optionTitles
    const cancelButtonIndex = options.length - 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.context as any).actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex: number) => {
        console.log('onLongPress', { buttonIndex })
      }
    )
  }

  styledBubbleToNext () {
    const { currentMessage, nextMessage, position, containerToNextStyle } =
      this.props
    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    )
      return [
        styles[position].containerToNext,
        containerToNextStyle?.[position],
      ]

    return null
  }

  styledBubbleToPrevious () {
    const {
      currentMessage,
      previousMessage,
      position,
      containerToPreviousStyle,
    } = this.props
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    )
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ]

    return null
  }

  renderQuickReplies () {
    const {
      currentMessage,
      onQuickReply,
      nextMessage,
      renderQuickReplySend,
      quickReplyStyle,
      quickReplyTextStyle,
      quickReplyContainerStyle,
    } = this.props

    if (currentMessage?.quickReplies) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...quickReplyProps
      } = this.props

      if (this.props.renderQuickReplies)
        return this.props.renderQuickReplies(quickReplyProps)

      return (
        <QuickReplies
          currentMessage={currentMessage}
          onQuickReply={onQuickReply}
          renderQuickReplySend={renderQuickReplySend}
          quickReplyStyle={quickReplyStyle}
          quickReplyTextStyle={quickReplyTextStyle}
          quickReplyContainerStyle={quickReplyContainerStyle}
          nextMessage={nextMessage}
        />
      )
    }

    return null
  }

  renderMessageText () {
    if (this.props.currentMessage?.text) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        optionTitles,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...messageTextProps
      } = this.props
      if (this.props.renderMessageText)
        return this.props.renderMessageText(messageTextProps)

      return <MessageText {...messageTextProps} />
    }
    return null
  }

  renderMessageImage () {
    if (this.props.currentMessage?.image) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...messageImageProps
      } = this.props

      if (this.props.renderMessageImage)
        return this.props.renderMessageImage(messageImageProps)

      return <MessageImage {...messageImageProps} />
    }
    return null
  }

  renderMessageVideo () {
    if (!this.props.currentMessage?.video)
      return null

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageVideoProps
    } = this.props

    if (this.props.renderMessageVideo)
      return this.props.renderMessageVideo(messageVideoProps)

    return <MessageVideo />
  }

  renderMessageAudio () {
    if (!this.props.currentMessage?.audio)
      return null

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageAudioProps
    } = this.props

    if (this.props.renderMessageAudio)
      return this.props.renderMessageAudio(messageAudioProps)

    return <MessageAudio />
  }

  renderTicks () {
    const {
      currentMessage,
      renderTicks,
      user,
    } = this.props

    if (renderTicks && currentMessage)
      return renderTicks(currentMessage)

    if (
      user &&
      currentMessage?.user &&
      currentMessage.user._id !== user._id
    )
      return null

    if (
      currentMessage &&
      (currentMessage.sent || currentMessage.received || currentMessage.pending)
    )
      return (
        <View style={styles.content.tickView}>
          {!!currentMessage.sent && (
            <Text style={[styles.content.tick, this.props.tickStyle]}>
              {'✓'}
            </Text>
          )}
          {!!currentMessage.received && (
            <Text style={[styles.content.tick, this.props.tickStyle]}>
              {'✓'}
            </Text>
          )}
          {!!currentMessage.pending && (
            <Text style={[styles.content.tick, this.props.tickStyle]}>
              {'🕓'}
            </Text>
          )}
        </View>
      )

    return null
  }

  renderTime () {
    if (this.props.currentMessage?.createdAt) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        textStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...timeProps
      } = this.props

      if (this.props.renderTime)
        return this.props.renderTime(timeProps)

      return <Time {...timeProps} />
    }
    return null
  }

  renderUsername () {
    const {
      currentMessage,
      user,
      renderUsername,
    } = this.props

    if (this.props.renderUsernameOnMessage && currentMessage) {
      if (user && currentMessage.user._id === user._id)
        return null

      if (renderUsername)
        return renderUsername(currentMessage.user)

      return (
        <View style={styles.content.usernameView}>
          <Text
            style={
              [styles.content.username, this.props.usernameStyle]
            }
          >
            {'~ '}
            {currentMessage.user.name}
          </Text>
        </View>
      )
    }

    return null
  }

  renderCustomView () {
    if (this.props.renderCustomView)
      return this.props.renderCustomView(this.props)

    return null
  }

  renderBubbleContent () {
    return (
      <View>
        {!this.props.isCustomViewBottom && this.renderCustomView()}
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageAudio()}
        {this.renderMessageText()}
        {this.props.isCustomViewBottom && this.renderCustomView()}
      </View>
    )
  }

  render () {
    const {
      position,
      containerStyle,
      wrapperStyle,
      bottomContainerStyle,
    } = this.props

    return (
      <View
        style={[
          stylesCommon.fill,
          styles[position].container,
          containerStyle && containerStyle[position],
        ]}
      >
        <View
          style={[
            styles[position].wrapper,
            this.styledBubbleToNext(),
            this.styledBubbleToPrevious(),
            wrapperStyle && wrapperStyle[position],
          ]}
        >
          <TouchableWithoutFeedback
            onPress={this.onPress}
            onLongPress={this.onLongPress}
            accessibilityRole='text'
            {...this.props.touchableProps}
          >
            <View>
              {this.renderBubbleContent()}
              <View
                style={[
                  styles[position].bottom,
                  bottomContainerStyle && bottomContainerStyle[position],
                ]}
              >
                {this.renderUsername()}
                {this.renderTime()}
                {this.renderTicks()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {this.renderQuickReplies()}
      </View>
    )
  }
}
