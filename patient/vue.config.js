const path = require("path")
const BundleTracker = require("webpack-bundle-tracker")

const SERVER_INTEGRATION = false

const PUBLIC_PATH = SERVER_INTEGRATION ? '/static/' : '/test_chat/'
const OUTPUT_PATH = SERVER_INTEGRATION ? '../server/public/client/' : './client/'
const BUNDLE_PATH = SERVER_INTEGRATION ? '../server/public/client-files.json' : './client-files.json'

process.env.VUE_APP_SERVER = process.env.NODE_ENV == 'production' ? 'cmd-test.piterweb.ru' : '127.0.0.1:8000'
process.env.VUE_APP_SERVER_URL = process.env.NODE_ENV == 'production' ? 'https://cmd-test.piterweb.ru' : 'http://127.0.0.1:8000'
process.env.VUE_APP_WS_URL = process.env.NODE_ENV == 'production' ? 'wss://cmd-test.piterweb.ru' : 'ws://127.0.0.1:8000'

module.exports = {
	pages: {
		index:  'src/core/index.js',
	},
	publicPath: process.env.NODE_ENV == 'production' ? PUBLIC_PATH : "http://localhost:8081/",
	outputDir: OUTPUT_PATH,
	devServer: {
        host: 'localhost',
        port: '8081',
		public: 'localhost:8081',
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
	},
    filenameHashing: false,
	configureWebpack: {
		// Создание бандла для подгрузки с сервера
		plugins: [
			new BundleTracker({ filename: BUNDLE_PATH }),
		],
		resolve: {
			// Короткие ссылки
			alias: {
				'__STATIC__': 'static',

				'src': path.resolve(__dirname, 'src'),
				'core': path.resolve(__dirname, 'src/core'),
				'plugins': path.resolve(__dirname, 'src/core/plugins'),

				'styles': path.resolve(__dirname, 'src/assets/styles'),
				'img': path.resolve(__dirname, 'src/assets/images'),
				'icons': path.resolve(__dirname, 'src/assets/icons'),
				'fonts': path.resolve(__dirname, 'src/assets/fonts'),
				'data': path.resolve(__dirname, 'src/assets/data'),

				'templates': path.resolve(__dirname, 'src/templates'),
				'pages': path.resolve(__dirname, 'src/templates/pages'),
				'global': path.resolve(__dirname, 'src/templates/global'),
				'includes': path.resolve(__dirname, 'src/templates/includes'),
				'layouts': path.resolve(__dirname, 'src/templates/layouts'),
			},
			extensions: ['*', '.js', '.vue', '.json']
		},
	},
	chainWebpack: config => {
        // config.optimization.delete('splitChunks')
        // config.optimization.splitChunks(false)
        config.plugins.delete('split-vendor')
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
		const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
		types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
	},
    css: {
        extract: false
    },
    productionSourceMap: false
}
function addStyleResource(rule) {
	rule.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				path.resolve(__dirname, './src/assets/styles/var.styl'),
			],
		})
}
