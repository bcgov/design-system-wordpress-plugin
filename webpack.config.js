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
            './src/Bcgov/DesignSystemPlugin/InPageNav/index.js', './src/Bcgov/DesignSystemPlugin/InPageNav/styles.css'
        ],
        'in-page-nav-editor': './src/Bcgov/DesignSystemPlugin/InPageNav/settings.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}; 