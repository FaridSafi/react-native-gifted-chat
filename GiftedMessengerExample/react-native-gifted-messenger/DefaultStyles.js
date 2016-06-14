import {
  PixelRatio,
  StyleSheet,
} from 'react-native';

const DefaultStyles = {
  /*
  ** Message components
  */
  Message: {
    left: StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginLeft: 5,
        marginRight: 0,
      },
    }),
    right: StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginRight: 5,
      },
    }),
  },
  Day: StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5,
      marginBottom: 10,
    },
    wrapper: {
      alignItems: 'center',
      backgroundColor: '#ccc',
      borderRadius: 10,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#fff',
      fontSize: 12,
    },
  }),
  Avatar: {
    left: StyleSheet.create({
      container: {
        marginRight: 5,
      },
    }),
    right: StyleSheet.create({
      container: {
        marginLeft: 5,
      },
    }),
  },
  Bubble: {
    left: StyleSheet.create({
      container: {
        borderRadius: 10,
        backgroundColor: 'blue',
      },
      containerToNext: {
        borderBottomLeftRadius: 0,
      },
      containerToPrevious: {
        borderTopLeftRadius: 0,
      },
    }),
    right: StyleSheet.create({
      container: {
        borderRadius: 10,
        backgroundColor: 'purple',
      },
      containerToNext: {
        borderBottomRightRadius: 0,
      },
      containerToPrevious: {
        borderTopRightRadius: 0,
      },
    }),
  },
  BubbleText: StyleSheet.create({
    text: {
      color: 'white',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    },
  }),
  Location: StyleSheet.create({
    mapView: {
      width: 150,
      height: 100,
      borderRadius: 8,
      margin: 3,
    },
  }),
  Time: StyleSheet.create({
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
  }),
  /*
  ** ToolbarInput components
  */
  InputToolbar: StyleSheet.create({
    container: {
      borderTopWidth: 1 / PixelRatio.get(),
      borderTopColor: '#E6E6E6',
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  }),
  Actions: StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 30,
      marginLeft: 10,
      marginBottom: 12,
    },
  }),
  Composer: StyleSheet.create({
    textInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 17,
    },
  }),
  Send: StyleSheet.create({
    container: {
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 17,
    },
    text: {
      color: '#6699CC',
      fontWeight: '600',
      fontSize: 17,
    },
  }),
};

export default DefaultStyles;
