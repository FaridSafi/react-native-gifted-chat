import { InteractionManager } from 'react-native';

export default {
  ...InteractionManager,
  runAfterInteractions: (f) => {
    // ensure f get called, timeout at 500ms
    // @gre workaround https://github.com/facebook/react-native/issues/8624
    let called = false;
    const timeout = setTimeout(() => {
      called = true;
      f();
    }, 500);
    InteractionManager.runAfterInteractions(() => {
      if (called) return;
      clearTimeout(timeout);
      f();
    });
  },
};
