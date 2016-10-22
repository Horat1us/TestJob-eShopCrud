/**
 * Created by horat1us on 19.10.16.
 */
"use strict";
const webpack = require('webpack');

module.exports = {
    entry: ["./src/main.js"],
    output: {
        filename: "bundle.js",
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {test: /\.css$/, loader: "style-loader!css-loader"}
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
            Tether: "tether",
            "window.Tether": "tether",
            Alert: "exports?Alert!bootstrap/js/dist/alert",
            Button: "exports?Button!bootstrap/js/dist/button",
            Carousel: "exports?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports?Collapse!bootstrap/js/dist/collapse",
            Dropdown: "exports?Dropdown!bootstrap/js/dist/dropdown",
            Modal: "exports?Modal!bootstrap/js/dist/modal",
            Popover: "exports?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports?Tab!bootstrap/js/dist/tab",
            Util: "exports?Util!bootstrap/js/dist/util",
        }),
    ]
};