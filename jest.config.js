module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  // moduleFileExtensions: [
  //   //不需要配置
  //   "js",
  //   "json",
  //   // 告诉 Jest 处理 `*.vue` 文件
  //   "vue",
  // ],
  testMatch: [
    //test文件所在位置
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)",
  ],
  // 转义
  // transform: {
  //   "^.+\\.vue$": "vue-jest",
  //   "^.+\\js$": "babel-jest",
  //   "^.+\\.(t|j)sx?$": "ts-jest",
  // },
  // moduleFileExtensions: ["vue", "js", "json", "jsx", "ts", "tsx", "node"],
  collectCoverage: true, //是否创建报告
  collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"], //创建报告的文件来源
  coverageReporters: ["html", "text-summary"], //报告的格式
  coveragePathIgnorePatterns: [], //生成报告需要忽略的文件，默认值为 node_modules
  globals: {
    //配置全局变量，此处我配置了一个全局变量VUE_APP_DATA，也可以在setup file中配置，如下说的lodash
    VUE_APP_DATA: { siteENV: "DEV" },
  },
  // setupFiles: ["<rootDir>/src/jest-setup.js"], //启动jest需要的文件

  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(vant)/)"],
};
