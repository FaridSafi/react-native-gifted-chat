import { useCallback } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Animated } from 'react-native';

import Entypo from '@expo/vector-icons/Entypo';

export type ReplyMessageProps = MessageProps<IMessage> & {
  rightActionContainerStyle?: StyleProp<ViewStyle>;
  rightActionImageContainerStyle?: StyleProp<ViewStyle>;
  setReplyOnSwipeOpen: (message: IMessage) => void;
};

const ReplyMessage = ({
  rightActionContainerStyle,
  rightActionImageContainerStyle,
  setReplyOnSwipeOpen,
  ...props
}: ReplyMessageProps) => {
  const renderRightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<string | number>) => {
      const size = progress.interpolate({
        inputRange: [0, 1, 100],
        outputRange: [0, 1, 1],
      });

      const trans = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -12, -20],
      });

      return (
        <Animated.View
          style={[
            rightActionContainerStyle,
            { transform: [{ scale: size }, { translateX: trans }] },
            { marginLeft: props.position === 'left' ? 0 : 16 },
          ]}>
          <View style={rightActionImageContainerStyle}>
            <Entypo name="reply" size={20} color="#4c9aff" />
          </View>
        </Animated.View>
      );
    },
    [props.position, rightActionContainerStyle, rightActionImageContainerStyle],
  );

  if (props.currentMessage.system) {
    return <Message {...props} />;
  }
  return (
    <Swipeable
      friction={1}
      key={props.currentMessage._id}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(_, swipeable) => swipeable.close()}
      onSwipeableWillOpen={() => setReplyOnSwipeOpen(props.currentMessage)}>
      <Message {...props}  />
    </Swipeable>
  );
};

export default ReplyMessage;

