import {
  PixelRatio,
} from 'react-native';

const Theme = {
  Day: {
    container: {
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 5,
    },
    text: {
      fontSize: 12,
    },
  },
  Time: {
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
    },
    text: {
      fontSize: 11,
      color: '#fff',
      backgroundColor: 'transparent',
      textAlign: 'right',
    },
  },
  Location: {
    mapView: {
      width: 150,
      height: 100,
      borderRadius: 8,
      margin: 3,
    },
  },
  BubbleText: {
    text: {
      color: 'white',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    },
  },

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
      marginLeft: 10,
      fontSize: 17,
    },
    actionsButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 30,
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
