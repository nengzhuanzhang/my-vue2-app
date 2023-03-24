let commonPlugins = [
  "lodash",
  [
    "import",
    {
      libraryName: "vant",
      libraryDirectory: "es",
      style: true,
    },
    "vant",
  ],
];
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: commonPlugins,
  env: {
    development: {
      plugins: ["dynamic-import-node", ...commonPlugins],
    },
  },
};
