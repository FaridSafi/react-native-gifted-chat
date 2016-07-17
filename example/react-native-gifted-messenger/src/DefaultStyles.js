/*
** ToolbarInput styles
*/
const toolbarInputStyles = {

  // Min and max heights of ToolbarInput and Composer
  // Needed for handling Composer's auto grow and ScrollView animation
  minInputToolbarHeight: 55,
  minComposerHeight: 35,
  maxComposerHeight: 100,

  Composer: {
    textInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 17,
    },
  },
};


/*
** Global styles
*/
// TODO to deprecate?
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


export default Object.assign({}, toolbarInputStyles, globalStyles);
