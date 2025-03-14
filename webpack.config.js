const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'index': ['./src/scripts/index.js', './src/styles/index.scss'],
        'auto-anchor': [
            './src/Bcgov/DesignSystemPlugin/AutoAnchor/AutoAnchor.js',
        ],
        'in-page-nav': [
            './src/Bcgov/DesignSystemPlugin/InPageNav/index.js',
        ],
        'in-page-nav-page-settings': [
            './src/Bcgov/DesignSystemPlugin/InPageNav/PageSettings.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}; 