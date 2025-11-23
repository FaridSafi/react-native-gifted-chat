import { StyleProp, ViewStyle } from 'react-native'
import { IMessage } from '../../../src'

export interface CustomViewProps {
  currentMessage: IMessage
  containerStyle?: StyleProp<ViewStyle>
  mapViewStyle?: StyleProp<ViewStyle>
}
