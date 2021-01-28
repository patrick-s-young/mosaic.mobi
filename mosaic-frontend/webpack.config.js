const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.png'],
    alias: {
      api: path.resolve(__dirname, './src/api/'),
      app: path.resolve(__dirname, './src/app/'),
      components: path.resolve(__dirname, './src/components/'),
      features: path.resolve(__dirname, './src/features/'),
      utils: path.resolve(__dirname, './src/utils/'),
      assets: path.resolve(__dirname, './src/assets')
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/assets/favicons/favicon.ico'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src/assets')
    
  },
  devtool: 'inline-source-map'
};