const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = () => {
	const config = {
		...defaultConfig,
		entry: {
			'metadata-settings': './assets/js/apps/metadata-settings/index.js',
			'document-repository': [
				'./assets/js/apps/document-repository/index.js',
			],
			index: './assets/scss/index.scss',
		},
		output: {
			path: path.resolve( __dirname, 'build' ),
			filename: '[name].js',
			clean: true,
		},
		externals: {
			...defaultConfig.externals,
			'@wordpress/element': 'wp.element',
			'@wordpress/components': 'wp.components',
			'@wordpress/api-fetch': 'wp.apiFetch',
			'@wordpress/i18n': 'wp.i18n',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								[
									'@babel/preset-react',
									{ runtime: 'automatic' },
								],
							],
						},
					},
				},
				{
					test: /\.css$/,
					use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader',
					],
				},
			],
		},
		plugins: [
			...defaultConfig.plugins,
			new MiniCssExtractPlugin( {
				filename: '[name].css',
			} ),
		],
		devtool: defaultConfig.devtool,
	};

	return config;
};
