module.exports = {
  configureWebpack: {
    devServer: {
      open: true,
      proxy: {
        '/netease-api': {
          target: 'http://localhost:3000',
          pathRewrite: { '^/netease-api': '' },
          changeOrigin: true,
          secure: false,
        },
      },
      port: 10086,
    },
    externals: process.env.NODE_ENV === 'production' ? {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
    }: {},
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/style/variables.scss";
          @import "~@/style/mixin.scss";
        `,
      },
    },
  },
}
