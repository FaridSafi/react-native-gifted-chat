import {
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { IMessage } from '../Models'

export interface DayProps<TMessage extends IMessage = IMessage> {
  currentMessage: TMessage
  dateFormat?: string
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}
