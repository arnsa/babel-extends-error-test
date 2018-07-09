/// Imports --------------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const lessToJs = require('less-vars-to-js');

/// Constants ------------------------------------------------------------------
const SOURCE = path.resolve(__dirname);
const NODE_MODULES = SOURCE + '/node_modules';
const THEME_VARIABLES = {
    ...lessToJs(fs.readFileSync(path.join(__dirname, './src/app/antd-theme-vars.less'), 'utf8')),
};

/// Exports --------------------------------------------------------------------
module.exports = (env, argv) => {
    const MODE = argv.mode;
    const DEV_MODE = MODE !== 'production';

    return {
        entry: './src/app/index.js',
        output: {
            path: path.resolve('./dist/'),
            filename: 'bundle.js',
            chunkFilename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                ['import', { libraryName: 'antd', style: true }],
                            ],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        DEV_MODE ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' },
                        { loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                modifyVars: THEME_VARIABLES,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|gif|jpe?g|woff|woff2|eot|ttf|svg)$/,
                    loader: 'url-loader?limit=100000',
                },
            ],
        },
        devServer: {
            historyApiFallback: true,
            host: '0.0.0.0',
            disableHostCheck: true
        },
        resolve: {
            modules: [NODE_MODULES],
            extensions: ['.js', '.json', '.svg', '.scss'],
        },
        plugins: [
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: 'static',
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(MODE || null),
            }),
            new HtmlWebPackPlugin({
                inject: true,
                template: './index.html',
                filename: 'index.html',
            }),
            new MiniCssExtractPlugin({
                filename: DEV_MODE ? '[name].css' : '[name].[hash].css',
                chunkFilename: DEV_MODE ? '[id].css' : '[id].[hash].css',
            }),
            DEV_MODE && new DashboardPlugin({ port: 4002 }),
            DEV_MODE && new WebpackNotifierPlugin({ title: 'App build', alwaysNotify: true }),
        ].filter(x => x),
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        ecma: 6,
                        output: {
                            comments: false,
                        },
                        compress: {
                            dead_code: true,
                            drop_console: true,
                        },
                    },
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                }),
                new OptimizeCSSAssetsPlugin({}),
            ],
            runtimeChunk: {
                name: 'manifest',
            },
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: -20,
                        chunks: 'all',
                    },
                },
            },
        },
    };
};
