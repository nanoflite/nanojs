const path = require('path');

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
    }
}