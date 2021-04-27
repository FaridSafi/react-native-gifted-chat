module.exports = function (api) {
  if (!!api) {
    api.cache(true);
  }
  return {
    presets: ['babel-preset-expo'],
  };
};
