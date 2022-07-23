import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkgJson from './package.json';

export default defineConfig({
	plugins: [
		react({
			jsxRuntime: 'classic',
		}),
		dts({
			insertTypesEntry: true,
		}),
		vanillaExtractPlugin(),
	],
	build: {
		minify: false,
		sourcemap: true,
		cssCodeSplit: false,
		lib: {
			entry: path.resolve(__dirname, 'src/react-json-friendly-viewer.ts'),
			name: 'ReactJsonFriendlyViewer',
			formats: ['cjs', 'es'],
			fileName: (format) =>
				format === 'es'
					? `react-json-friendly-viewer.mjs`
					: `react-json-friendly-viewer.js`,
		},
		rollupOptions: {
			external: ['react', 'react-dom'].concat(
				Object.keys(pkgJson.dependencies)
			),
		},
	},
});
