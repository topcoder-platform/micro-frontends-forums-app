/* global process */

module.exports = function (api) {
  const IS_DEV = process.env.APPMODE !== "production";
  api.cache(IS_DEV);

  const generateScopedName = IS_DEV
    ? "[hash:base64:6]"
    : "forums_[path][name]___[local]___[hash:base64:6]";

  return {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          useESModules: true,
          regenerator: false,
        },
      ],
      // [
      //   "react-css-modules",
      //   {
      //     filetypes: {
      //       ".scss": {
      //         syntax: "postcss-scss",
      //       },
      //     },
      //     generateScopedName,
      //   },
      // ],
      "inline-react-svg",
    ],
    env: {
      test: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "current node",
            },
          ],
        ],
        // plugins: [
        //   [
        //     "module-resolver",
        //     {
        //       alias: {
        //         assets: "./src/assets",
        //         styles: "./src/styles",
        //         components: "./src/components",
        //         hooks: "./src/hooks",
        //         utils: "./src/utils",
        //         constants: "./src/constants",
        //         services: "./src/services",
        //       },
        //     },
        //   ],
        // ],
      },
    },
  };
};
