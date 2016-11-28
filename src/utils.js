import moment from 'moment';

export function isSameDay(currentMessage = {}, diffMessage = {}) {
  let diff = 0;
  if (diffMessage.createdAt && currentMessage.createdAt) {
    diff = Math.abs(moment(diffMessage.createdAt).startOf('day').diff(moment(currentMessage.createdAt).startOf('day'), 'days'));
  } else {
    diff = 1;
  }
  if (diff === 0) {
    return true;
  }
  return false;
}

export function isSameUser(currentMessage = {}, diffMessage = {}) {
  if (diffMessage.user && currentMessage.user) {
    if (diffMessage.user._id === currentMessage.user._id) {
      return true;
    }
  }
  return false;
}
