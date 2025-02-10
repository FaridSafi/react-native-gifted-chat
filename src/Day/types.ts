import {
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'

export interface DayProps {
  createdAt: Date | number
  dateFormat?: string
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}
