const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    hot: true,
    open: true,
    port: 3001,
  },
  entry: {
    widget: ['./styles/widget.css', './src/ChatWidget.tsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'widget.js',
    publicPath: '',
    library: {
      name: 'LAWMAai',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: '> 0.25%, not dead',
                  useBuiltIns: 'usage',
                  corejs: 3
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic'
                }],
                '@babel/preset-typescript'
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'tailwindcss',
                  'autoprefixer',
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true,
              ref: true,
              titleProp: true,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "path": false,
      "fs": false
    }
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        },
        extractComments: false
      }),
    ],
    splitChunks: false
  }
};
