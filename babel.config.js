module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["module:@react-native/babel-preset", "nativewind/babel"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@constants": "./src/constants",
            "@screens": "./src/screens",
            "@styles": "./src/styles",
          }
        }
      ]
    ],
  }
};
