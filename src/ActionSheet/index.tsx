import { Platform } from 'react-native'

import ActionSheetCustom from './ActionSheetCustom'
import ActionSheetIOS from './ActionSheet.ios'

const ActionSheet = Platform.OS === 'ios' ? ActionSheetIOS : ActionSheetCustom

export { ActionSheetCustom }
export default ActionSheet
