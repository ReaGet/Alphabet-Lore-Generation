const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "app/index.js"),
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ]
      },
      {
        test: /\.(png|svg|jp(e*)g|gif|eot|ttf|woff|woff2)$/,
        use: [
          'url-loader',
          { 
            loader: "image-webpack-loader",
            options: {
              disable: true,
              limit: 8000,
              name: 'img/[hash]-[name].[ext]',
              publicPath: 'assets'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/index.html"),
    }),
  ],
}