let path = require('path');
let config = require('./public/config')
function resolve(dir) {
  return path.join(__dirname, dir)
}
// console.log("BASE_API:",config)
module.exports = {
  publicPath: './',
  chainWebpack: config => {
    //设置别名
    config.resolve.alias
      .set('@', resolve('src'))
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  devServer: {
    open: false,  //打开浏览器窗口
    inline: true,
    port: 8081,
    proxy: {
      '/platform': {
        target: config.BASE_API, // 测试环境
        changeOrigin: true,
        // pathRewrite: { '^/api': '' },
      },
    },
  },
  //定义scss全局变量
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/global.scss";`
      }
    }
  }
}


