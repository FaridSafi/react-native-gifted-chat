import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Color } from '../Color'
import { IMessage } from '../Models'
import { MessageReactionsDisplayProps } from './types'

export const MessageReactions = <TMessage extends IMessage = IMessage>(
  props: MessageReactionsDisplayProps<TMessage>
): React.ReactElement | null => {
  const {
    reactions,
    currentUserId,
    position,
    onReactionPress,
    containerStyle,
    reactionStyle,
    reactionActiveStyle,
    reactionTextStyle,
    reactionCountStyle,
  } = props

  if (!reactions || reactions.length === 0)
    return null

  return (
    <View
      style={[
        styles.container,
        position === 'right' ? styles.containerRight : styles.containerLeft,
        containerStyle,
      ]}
    >
      {reactions.map(reaction => {
        const isActive = currentUserId != null && reaction.userIds.includes(currentUserId)
        const count = reaction.userIds.length

        return (
          <Pressable
            key={reaction.emoji}
            onPress={() => onReactionPress?.(reaction.emoji)}
            style={({ pressed }) => [
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
              isActive ? reactionActiveStyle : reactionStyle,
              pressed && styles.pillPressed,
            ]}
          >
            <Text style={[styles.emoji, reactionTextStyle]}>{reaction.emoji}</Text>
            {count > 1 && (
              <Text
                style={[
                  styles.count,
                  isActive && styles.countActive,
                  reactionCountStyle,
                ]}
              >
                {count}
              </Text>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
    gap: 4,
  },
  containerLeft: {
    justifyContent: 'flex-start',
    paddingLeft: 4,
  },
  containerRight: {
    justifyContent: 'flex-end',
    paddingRight: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
  },
  pillInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: 'rgba(0, 132, 255, 0.15)',
    borderColor: Color.defaultBlue,
  },
  pillPressed: {
    opacity: 0.7,
  },
  emoji: {
    fontSize: 15,
    lineHeight: 20,
  },
  count: {
    fontSize: 12,
    marginLeft: 3,
    color: Color.black,
    lineHeight: 20,
  },
  countActive: {
    color: Color.defaultBlue,
    fontWeight: '600',
  },
})
