const path = require("path");
module.exports = {
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js"
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};
