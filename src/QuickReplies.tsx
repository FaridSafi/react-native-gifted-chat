import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { IMessage, Reply } from './Models'
import Color from './Color'
import { warning, StylePropType } from './utils'
import { useCallbackOne } from 'use-memo-one'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 300,
  },
  quickReply: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    maxWidth: 200,
    paddingVertical: 7,
    paddingHorizontal: 12,
    minHeight: 50,
    borderRadius: 13,
    margin: 3,
  },
  quickReplyText: {
    overflow: 'visible',
  },
  sendLink: {
    borderWidth: 0,
  },
  sendLinkText: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
  },
})

export interface QuickRepliesProps {
  nextMessage?: IMessage
  currentMessage?: IMessage
  color?: string
  sendText?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  onQuickReply?(reply: Reply[]): void
  renderQuickReplySend?(): React.ReactNode
}

const sameReply = (currentReply: Reply) => (reply: Reply) =>
  currentReply.value === reply.value

const diffReply = (currentReply: Reply) => (reply: Reply) =>
  currentReply.value !== reply.value

export function QuickReplies(props: QuickRepliesProps) {
  const {
    currentMessage,
    nextMessage,
    color,
    quickReplyStyle,
    onQuickReply,
    sendText,
    renderQuickReplySend,
  } = props
  const { type } = currentMessage!.quickReplies!
  const [replies, setReplies] = useState<Reply[]>([])

  const shouldComponentDisplay = useMemo(() => {
    const hasReplies = !!currentMessage && !!currentMessage!.quickReplies
    const hasNext = !!nextMessage && !!nextMessage!._id
    const keepIt = currentMessage!.quickReplies!.keepIt

    if (hasReplies && !hasNext) {
      return true
    }

    if (hasReplies && hasNext && keepIt) {
      return true
    }

    return false
  }, [currentMessage, nextMessage])

  if (!shouldComponentDisplay) {
    return null
  }

  const handlePress = useCallbackOne(
    (reply: Reply) => () => {
      if (currentMessage) {
        const { type } = currentMessage.quickReplies!
        switch (type) {
          case 'radio': {
            handleSend([reply])()
            return
          }
          case 'checkbox': {
            if (replies.find(sameReply(reply))) {
              setReplies(replies.filter(diffReply(reply)))
            } else {
              setReplies([...replies, reply])
            }
            return
          }
          default: {
            warning(`onQuickReply unknown type: ${type}`)
            return
          }
        }
      }
    },
    [replies, currentMessage],
  )

  const handleSend = (repliesData: Reply[]) => () => {
    onQuickReply?.(
      repliesData.map((reply: Reply) => ({
        ...reply,
        messageId: currentMessage!._id,
      })),
    )
  }

  return (
    <View style={styles.container}>
      {currentMessage!.quickReplies!.values.map(
        (reply: Reply, index: number) => {
          const selected = type === 'checkbox' && replies.find(sameReply(reply))

          return (
            <TouchableOpacity
              onPress={handlePress(reply)}
              style={[
                styles.quickReply,
                quickReplyStyle,
                { borderColor: color },
                selected && { backgroundColor: color },
              ]}
              key={`${reply.value}-${index}`}
            >
              <Text
                numberOfLines={10}
                ellipsizeMode={'tail'}
                style={[
                  styles.quickReplyText,
                  { color: selected ? Color.white : color },
                ]}
              >
                {reply.title}
              </Text>
            </TouchableOpacity>
          )
        },
      )}
      {replies.length > 0 && (
        <TouchableOpacity
          style={[styles.quickReply, styles.sendLink]}
          onPress={handleSend(replies)}
        >
          {renderQuickReplySend?.() || (
            <Text style={styles.sendLinkText}>{sendText}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

QuickReplies.defaultProps = {
  currentMessage: {
    quickReplies: [],
  },
  onQuickReply: () => {},
  color: Color.peterRiver,
  sendText: 'Send',
  keepReplies: false,
  renderQuickReplySend: undefined,
  quickReplyStyle: undefined,
}

QuickReplies.propTypes = {
  currentMessage: PropTypes.object.isRequired,
  onQuickReply: PropTypes.func,
  color: PropTypes.string,
  sendText: PropTypes.string,
  keepReplies: PropTypes.bool,
  renderQuickReplySend: PropTypes.func,
  quickReplyStyle: StylePropType,
}
