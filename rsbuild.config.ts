import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBabel } from '@rsbuild/plugin-babel';

export default defineConfig({
	plugins: [
		pluginReact(),
		pluginBabel({
			include: /\.(?:jsx|tsx)$/,
			babelLoaderOptions(opts) {
				opts.plugins?.unshift('babel-plugin-react-compiler');
			},
		}),
	],
	html: {
		title: 'DChatt',
		favicon: './public/favicon.png',
	},
	source: {
		aliasStrategy: 'prefer-tsconfig',
	},
	tools: {
		rspack: {
			ignoreWarnings: [/Critical/g, /parse/g],
		},
	},
});
