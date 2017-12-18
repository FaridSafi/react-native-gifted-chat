import { Platform } from 'react-native';

export default {
  MIN_COMPOSER_HEIGHT: Platform.select({
    ios: 33,
    android: 41,
  }),
  MAX_COMPOSER_HEIGHT: 100,
  DEFAULT_PLACEHOLDER: 'Type a message...',
};
