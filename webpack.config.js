const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

// Split entries into document repository and other entries
const documentRepoEntries = {
    'metadata-settings': './src/Bcgov/DesignSystemPlugin/DocumentRepository/js/src/metadata-index.js',
    'document-repository': './src/Bcgov/DesignSystemPlugin/DocumentRepository/js/src/index.js'
};

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

// Create separate configurations for document repository and other files
const documentRepoConfig = {
    ...defaultConfig,
    entry: documentRepoEntries,
    output: {
        path: path.resolve(__dirname, 'src/Bcgov/DesignSystemPlugin/DocumentRepository/build'),
        filename: '[name].js'
    }
};

const otherConfig = {
    ...defaultConfig,
    entry: otherEntries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
};

module.exports = [documentRepoConfig, otherConfig]; 