// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    // postcss-pxtorem 插件的版本需要 >= 5.0.0
    "postcss-pxtorem": {
      rootValue({ file }) {
        return file.indexOf("vant") !== -1 ? 37.5 : 75;
      },
      propList: ["*"],
    },
    // to edit target browsers: use "browserslist" field in package.json
    autoprefixer: {},
  },
};
