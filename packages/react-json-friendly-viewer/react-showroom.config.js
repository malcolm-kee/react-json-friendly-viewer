// @ts-check
const { defineConfig } = require('react-showroom');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = defineConfig({
	componentsEntry: {
		name: 'react-json-friendly-viewer',
		path: './src/react-json-friendly-viewer.ts',
		dts: false,
	},
	components: 'src/json-pretty-viewer/**/*.tsx',
	webpackConfig: {
		plugins: [new VanillaExtractPlugin()],
	},
	theme: {
		title: 'react-json-friendly-viewer',
	},
	url: 'https://react-json-friendly-viewer.netlify.app',
});
