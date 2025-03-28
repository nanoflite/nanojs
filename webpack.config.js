const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'nanojs', 'index.mjs'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'nanojs.mjs',
        module: true,  // <-- Important: Output an ES module
        library: {
            type: 'module' // <-- Important: Enables exporting your modules
        }
    },
    experiments: {
        outputModule: true // <-- Required to enable ESM output
    }
}