const path = require('path');

module.exports = {
  watch: true,
  mode: "production",
  entry: {
    index: "./src/index.js",
    kick: "./src/kick.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  }};