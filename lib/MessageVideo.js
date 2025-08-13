import React from 'react';
import Color from './Color';
import { View, Text } from 'react-native';
export function MessageVideo() {
    return (<View style={{ padding: 20 }}>
      <Text style={{ color: Color.alizarin, fontWeight: '600' }}>
        {'Video is not implemented by GiftedChat.'}
      </Text>
      <Text style={{ color: Color.alizarin, fontWeight: '600' }}>
        {'\nYou need to provide your own implementation by using renderMessageVideo prop.'}
      </Text>
    </View>);
}
//# sourceMappingURL=MessageVideo.js.map