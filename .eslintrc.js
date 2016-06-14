module.exports = {
  extends: 'airbnb',
  plugins: [
    'react',
  ],
  rules: {
    "max-len": ["error", 160, 4, {"ignoreUrls": true}],
    "react/jsx-boolean-value": 0
  }
};
