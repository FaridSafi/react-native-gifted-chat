import {
  PixelRatio,
} from 'react-native';

/*
** Message styles
*/
const messageStyles = {
  LoadEarlier: {
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
  },
  Message: {
    left: {
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginLeft: 5,
        marginRight: 0,
      },
    },
    right: {
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginRight: 5,
      },
    },
  },
  Day: {
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
  },
  Avatar: {
    image: {
      height: 40,
      width: 40,
    },
    left: {
      container: {
        marginRight: 5,
      },
    },
    right: {
      container: {
        marginLeft: 5,
      },
    },
  },
  Bubble: {
    left: {
      container: {
        flex: 1,
        alignItems: 'flex-start',
      },
      wrapper: {
        borderRadius: 10,
        backgroundColor: '#F1F0F0',
        marginRight: 60,
      },
      containerToNext: {
        borderBottomLeftRadius: 0,
      },
      containerToPrevious: {
        borderTopLeftRadius: 0,
      },
    },
    right: {
      container: {
        flex: 1,
        alignItems: 'flex-end',
      },
      wrapper: {
        borderRadius: 10,
        backgroundColor: '#0084FF',
        marginLeft: 60,
      },
      containerToNext: {
        borderBottomRightRadius: 0,
      },
      containerToPrevious: {
        borderTopRightRadius: 0,
      },
    },
  },
  BubbleImage: {
    container: {
    },
    image: {
      width: 150,
      height: 100,
      borderRadius: 8,
      margin: 3,
      resizeMode: 'cover',
    },
  },
  ParsedText: {
    left: {
      container: {
      },
      text: {
        color: 'black',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
      },
      link: {
        color: 'black',
        textDecorationLine: 'underline',
      },
    },
    right: {
      container: {
      },
      text: {
        color: 'white',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
      },
      link: {
        color: 'white',
        textDecorationLine: 'underline',
      },
    },
  },
  Location: {
    container: {
    },
    mapView: {
      width: 150,
      height: 100,
      borderRadius: 8,
      margin: 3,
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
};

/*
** ToolbarInput styles
*/
const toolbarInputStyles = {

  // Min and max heights of ToolbarInput and Composer
  // Needed for handling Composer's auto grow and ScrollView animation
  minInputToolbarHeight: 55,
  minComposerHeight: 35,
  maxComposerHeight: 100,

  InputToolbar: {
    container: {
      borderTopWidth: 1 / PixelRatio.get(),
      borderTopColor: '#E6E6E6',
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  },
  Actions: {
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
  },
  Composer: {
    textInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 17,
    },
  },
  Send: {
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
  },
};


/*
** Global styles
*/
const globalStyles = {
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
};


export default Object.assign({}, messageStyles, toolbarInputStyles, globalStyles);
