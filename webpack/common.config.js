/* eslint-disable import/no-commonjs, global-require */
const webpack = require('webpack');
const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Stylish = require('webpack-stylish');

const postcssConfig = require('./postcssPlugins.js');

const cssLocalIdentName = '[name]__[local]_[hash:base64:5]'; // '[hash:base64:5]'
const isSourceMapEnabled = !!process.env.SOURCE_MAP;

const common = {
    entry: {
        app: './src/apps/client/AppProvider.jsx',
        admin: './src/apps/admin/AppProvider.jsx'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            src: path.resolve(__dirname, 'src')
        }
    },
    mode: 'development',
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-'
        },
        runtimeChunk: false
    },
    module: {
        rules: [
            {
                test: /\.(ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'application/octet-stream'
                }
            },
            {
                test: /\.eot$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg$/,
                loader: 'file-loader',
                exclude: [/ckeditor5-[^/]+\/theme\/icons\/[^/]+\.svg$/]
            },
            {
                test: /ckeditor5-[^/]+\/theme\/icons\/[^/]+\.svg$/,
                use: [ 'raw-loader' ]
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/png'
                }
            },
            {
                test: /\.gif$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/gif'
                }
            },
            {
                test: /\.jpg$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/jpg'
                }
            },
            {
                test: /\.webp$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/webp'
                }
            },
            {
                test: /\.css?$/,
                loaders: ['style-loader', 'css-loader'],
                include: [/node_modules/]
            },
            {
                test: /\.css?$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve('.tmp/cache-loader')
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: false,
                            modules: true,
                            localIdentName: cssLocalIdentName,
                            sourceMap: isSourceMapEnabled,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssConfig,
                            sourceMap: isSourceMapEnabled
                        }
                    }
                ],
                exclude: [/node_modules/]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['public'], {
            root: path.join(__dirname, '..')
        }),
        // new webpack.NormalModuleReplacementPlugin(/babel-runtime\/core-js\/promise/, path.resolve(__dirname, '../utils/polyfill/promise')),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

            'process.env.BROWSER': process.env.BROWSER || false,
            'process.env.SERVER': process.env.SERVER || false,

            'process.env.ENABLE_DEVTOOLS': process.env.NODE_ENV === 'development'
        }),
        new Stylish()
    ]
};
const admin = {
    ...common,
    entry: {
        admin: './src/apps/admin/AppProvider.jsx'
    }
};
const client = {
    ...common,
    entry: {
        client: './src/apps/client/AppProvider.jsx'
    }
};

module.exports = {
    admin, client
};
