import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import Color from './Color'
import { TouchableOpacity } from './components/TouchableOpacity'
import stylesCommon from './styles'

export interface LoadEarlierMessagesProps {
  isAvailable: boolean
  isLoading: boolean
  onPress: () => void
  isInfiniteScrollEnabled?: boolean
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  activityIndicatorStyle?: StyleProp<ViewStyle>
  activityIndicatorColor?: string
  activityIndicatorSize?: number | 'small' | 'large'
}

export const LoadEarlierMessages: React.FC<LoadEarlierMessagesProps> = ({
  isLoading = false,
  onPress,
  label = 'Load earlier messages',
  containerStyle,
  wrapperStyle,
  textStyle,
  activityIndicatorColor = 'white',
  activityIndicatorSize = 'small',
  activityIndicatorStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole='button'
    >
      <View style={[stylesCommon.centerItems, styles.wrapper, wrapperStyle]}>
        {
          isLoading
            ? (
              <ActivityIndicator
                color={activityIndicatorColor}
                size={activityIndicatorSize}
                style={[styles.activityIndicator, activityIndicatorStyle]}
              />
            )
            : (
              <View style={styles.textContainer}>
                <Text style={[styles.text, textStyle]}>
                  {label}
                </Text>
              </View>
            )
        }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  wrapper: {
    backgroundColor: Color.defaultColor,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textContainer: {
    paddingTop: 3,
    paddingBottom: 4,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.white,
    fontSize: 12,
    lineHeight: 13,
  },
  activityIndicator: {
    paddingHorizontal: 20,
  },
})
