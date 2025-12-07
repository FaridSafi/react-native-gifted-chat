import { IChatMessage } from "@/components/chat-examples/ReplyExample";
import { Bubble, BubbleProps } from "react-native-gifted-chat";
import { useCallback } from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";


export type ReplyBubbleProps = BubbleProps<IChatMessage>;

const ReplyBubble = ({
  ...props
}: ReplyBubbleProps) => {
     const renderReply = useCallback(() => {
      if (props.currentMessage.replyMessage && props.currentMessage.replyMessage._id) {
        return (
          <Pressable
            onPress={() => {
              if (props.currentMessage.replyMessage) {
                // onReplyPress(props.currentMessage.replyMessage._id.toString());
              }
            }}
            >
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 4, paddingHorizontal: 12 }}>  
              <View>
                <ThemedText type="defaultSemiBold">
                  {props.currentMessage.replyMessage.userName}
                </ThemedText>
                <ThemedText
                  numberOfLines={1}>
                  {props.currentMessage.replyMessage.text}
                </ThemedText>
              </View>
            </View>
          </Pressable>
        );
      }
    }, [ props.currentMessage.replyMessage]);
  return (
    <>
      <Bubble
        {...props}
        renderMessageImage={() => renderReply()}
      />
    </>
  );
};


export default ReplyBubble;
