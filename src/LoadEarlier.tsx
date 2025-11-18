import React, { useMemo } from 'react'
import {
  ActivityIndicator,
  Platform,
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    backgroundColor: Color.defaultColor,
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.white,
    fontSize: 12,
  },
  activityIndicator: {
    marginTop: Platform.select({
      ios: -14,
      android: -16,
      default: -15,
    }),
  },
})

export interface LoadEarlierProps {
  isLoadingEarlier?: boolean
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  activityIndicatorStyle?: StyleProp<ViewStyle>
  activityIndicatorColor?: string
  activityIndicatorSize?: number | 'small' | 'large'
  onLoadEarlier: () => void
}

export const LoadEarlier: React.FC<LoadEarlierProps> = ({
  isLoadingEarlier = false,
  onLoadEarlier,
  label = 'Load earlier messages',
  containerStyle,
  wrapperStyle,
  textStyle,
  activityIndicatorColor = 'white',
  activityIndicatorSize = 'small',
  activityIndicatorStyle,
}) => {
  const loadingContent = useMemo(() => (
    <View>
      <Text style={[styles.text, textStyle, { opacity: 0 }]}>
        {label}
      </Text>
      <ActivityIndicator
        color={activityIndicatorColor!}
        size={activityIndicatorSize!}
        style={[styles.activityIndicator, activityIndicatorStyle]}
      />
    </View>
  ), [label, textStyle, activityIndicatorColor, activityIndicatorSize, activityIndicatorStyle])

  const labelContent = useMemo(() => (
    <Text style={[styles.text, textStyle]}>{label}</Text>
  ), [label, textStyle])

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onLoadEarlier}
      disabled={isLoadingEarlier}
      accessibilityRole='button'
    >
      <View style={[stylesCommon.centerItems, styles.wrapper, wrapperStyle]}>
        {isLoadingEarlier ? loadingContent : labelContent}
      </View>
    </TouchableOpacity>
  )
}
