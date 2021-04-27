module.exports = () => ({
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: '8.9.0',
        },
        modules: false,
      },
    ],
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    require.resolve('@babel/plugin-proposal-class-properties'),
    [require.resolve('@babel/plugin-transform-modules-commonjs'), { lazy: source => true }],
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
  ],
});
