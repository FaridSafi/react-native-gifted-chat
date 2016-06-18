import {
  PixelRatio,
  StyleSheet,
} from 'react-native';

/*
** Message styles
*/
let DefaultStyles = {
  LoadEarlier: StyleSheet.create({
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
        flex: 1,
        alignItems: 'flex-start',
      },
      wrapper: {
        borderRadius: 10,
        backgroundColor: 'blue',
        marginRight: 60,
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
        flex: 1,
        alignItems: 'flex-end',
      },
      wrapper: {
        borderRadius: 10,
        backgroundColor: 'purple',
        marginLeft: 60,
      },
      containerToNext: {
        borderBottomRightRadius: 0,
      },
      containerToPrevious: {
        borderTopRightRadius: 0,
      },
    }),
  },
  BubbleImage: StyleSheet.create({
    container: {
    },
    image: {
      width: 150,
      height: 100,
      borderRadius: 8,
      margin: 3,
      resizeMode: 'cover',
    },
  }),
  BubbleText: StyleSheet.create({
    container: {
    },
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
};

/*
** ToolbarInput styles
*/
DefaultStyles = Object.assign(DefaultStyles, {

  // Min and max heights of ToolbarInput and Composer
  // Needed for handling Composer's auto grow and ScrollView animation
  minInputToolbarHeight: 55,
  minComposerHeight: 35,
  maxComposerHeight: 100,

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
      height: 27,
      marginLeft: 10,
      marginBottom: 12,
    },
    icon: {
      width: 27,
      height: 30,
      tintColor: '#ccc',
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
});


/*
** Global styles
*/
DefaultStyles = Object.assign(DefaultStyles, {
  NavBar: {
    statusBar: {
      backgroundColor: '#FFF',
    },
    navBar: {
      backgroundColor: '#FFF',
    },
    title: {
      color: '#000',
    },
    buttonText: {
      color: '#000',
    },
  },
});

export default DefaultStyles;
