module.exports = function (api) {
  api.cache(true);
  return {
    // NativeWind v4 works via babel-preset-expo's jsxImportSource (routes JSX
    // through nativewind/jsx-runtime). We deliberately omit the legacy
    // `nativewind/babel` preset: in this version it re-exports
    // react-native-css-interop's babel which hard-codes
    // `react-native-worklets/plugin` (reanimated 4 only) and breaks the build
    // under reanimated 3.16.
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    // react-native-reanimated/plugin must remain last.
    plugins: ['react-native-reanimated/plugin'],
  };
};
