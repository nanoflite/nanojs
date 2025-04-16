const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'nanojs', 'index.mjs'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'nanojs.mjs',
        module: true,
        library: {
            type: 'module'
        }
    },
    experiments: {
        outputModule: true
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'style/nano.css', to: 'nano.css' }
            ]
        })
    ]
}