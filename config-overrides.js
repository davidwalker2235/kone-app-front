const { override, addWebpackModuleRule, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
    addWebpackModuleRule({
        test: /\.mjs$/,
        enforce: 'pre',
        exclude: /node_modules\/@mediapipe\/tasks-vision/,
        use: ['source-map-loader'],
    }),
    addWebpackPlugin(
        new webpack.IgnorePlugin({
            resourceRegExp: /@mediapipe\/tasks-vision\/vision_bundle_mjs\.js\.map/,
        })
    )
);