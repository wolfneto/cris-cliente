module.exports = {
    lintOnSave: false,

    pluginOptions: {
        quasar: {
            importStrategy: 'manual',
            rtlSupport: false
        }
    },

    devServer: {
        port: 8080,
        public: '0.0.0.0:8080',
        disableHostCheck: true
    },
    publicPath: "/erp/",

    transpileDependencies: [
        'quasar'
    ]
}