// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
  chainWebpack: config =>{
    // 产品发布模式 配置入口
    config.when(process.env.NODE_ENV ==='production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')

      // 通过externals加载外部CDN资源 只需要在发布模式
      config.set('externals',{
        vue: 'Vue',
        // 'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts:'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 根据不同的发布模式 显示不同的title
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })

    })
    // 产品开发模式 配置入口
    config.when(process.env.NODE_ENV ==='development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
      
      // 根据不同的发布模式 显示不同的title
      config.plugin('html').tap(args =>{
        args[0].isProd = false
        return args
      })
    })
  }
}
