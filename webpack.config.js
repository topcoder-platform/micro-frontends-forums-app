/* global __dirname */
/* global process */
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const path = require("path");
const autoprefixer = require("autoprefixer");

const IS_DEV = process.env.APPMODE !== "production";

const cssLocalIdent = IS_DEV
  ? "forums_[path][name]___[local]___[hash:base64:6]"
  : "[hash:base64:6]";

const srcDir = path.resolve(__dirname, "src");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "topcoder",
    projectName: "micro-frontends-forums-app",
    webpackConfigEnv,
  });

  return webpackMerge.smart(defaultConfig, {
    output: {
      publicPath: "/forums-app",
    },
    // modify the webpack config however you'd like to by adding to this object
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: cssLocalIdent,
                  auto: true,
                },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [autoprefixer],
                },
              },
            },
            // { loader: "resolve-url-loader" },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: IS_DEV ? "expanded" : "compressed",
                  precision: 8,
                  includePaths: [path.join(srcDir, "styles")],
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.(gif|jpg|png|svg)$/,
          include: /.*assets[/\\]images.+/,
          use: {
            loader: "url-loader",
            options: {
              limit: 4096,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".scss"],
      modules: [srcDir, "node_modules"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          APPMODE: JSON.stringify(process.env.APPMODE),
          APPENV: JSON.stringify(process.env.APPENV),
        },
      }),
    ],
  });
};
