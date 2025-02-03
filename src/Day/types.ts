import {
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps,
} from 'react-native'
import { IMessage } from '../Models'

export interface DayProps<TMessage extends IMessage = IMessage> {
  currentMessage: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  textProps?: TextProps
  dateFormat?: string
  inverted?: boolean
}
