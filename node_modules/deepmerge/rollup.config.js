import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const pkg = require(`./package.json`)

export default {
	input: `index.js`,
	plugins: [
		commonjs(),
		resolve(),
	],
	output: [
		{
			name: 'deepmerge',
			file: pkg.main,
			format: `umd`
		},
	],
}
