const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

const otherEntries = {
    'index': ['./src/scripts/index.js', './src/styles/index.scss'],
    'auto-anchor': [
        './src/Bcgov/DesignSystemPlugin/AutoAnchor/AutoAnchor.js',
    ],
    'in-page-nav': [
        './src/Bcgov/DesignSystemPlugin/InPageNav/view.js', './src/Bcgov/DesignSystemPlugin/InPageNav/style.css'
    ],
    'in-page-nav-editor': './src/Bcgov/DesignSystemPlugin/InPageNav/edit.js'
};

const otherConfig = {
    ...defaultConfig,
    entry: otherEntries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
};

module.exports = otherConfig; 