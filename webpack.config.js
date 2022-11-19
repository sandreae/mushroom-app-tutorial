const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  if (!fs.existsSync('./config.json')) {
    throw new Error(
      'You have to create a `config.json` file first! See README for instructions',
    );
  }

  return {
    entry: './src/index.tsx',
    output: {
      filename: 'index.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css'],
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      hot: false,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: '72 Seasons',
      }),
    ],
  };
};
