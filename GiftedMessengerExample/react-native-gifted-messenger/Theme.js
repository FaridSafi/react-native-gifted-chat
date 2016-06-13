import {
  PixelRatio,
} from 'react-native';

const Theme = {
  Composer: {
    container: {
      borderTopWidth: 1 / PixelRatio.get(),
      borderTopColor: '#E6E6E6',
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    textInput: {
      flex: 1,
      // paddingLeft: 15,
      marginLeft: 10,
      fontSize: 17,
    },
    actionsButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 30,
      // borderRadius: 15,
      // borderWidth: 2,
      // borderColor: '#6699CC',
      marginLeft: 10,
      marginBottom: 12,
    },
    actionsText: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 20,
      color: '#6699CC',
    },
    sendButton: {
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 17,
    },
    sendButtonText: {
      color: '#6699CC',
      fontWeight: '600',
      fontSize: 17,
    },
  }
};

export default Theme;
