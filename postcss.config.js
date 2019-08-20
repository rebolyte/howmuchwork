module.exports = {
	plugins: [
		require('postcss-import')({
			path: ['./src/styles']
		}),
		require('tailwindcss')('./tailwind.config.js'),
		require('postcss-nested'),
		require('autoprefixer')
	]
};
