import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/font/iconfont.css'
// 导入tree
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入NProgress（进度条）
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  console.log(config);
  // 在 request 拦截器中 展示进度条 NProgress.start();
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token_');
  // 在最后 必须返回config 
  return config;
})
// 在 response 拦截器中 隐藏进度条 NProgress.done();
axios.interceptors.response.use(config =>{
  NProgress.done();
  return config
})

Vue.prototype.$http = axios

// 阻止启动时 生成生产提示
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

// 定义时间格式化过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal);
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0');
  const d = (dt.getDate() + '').padStart(2,'0');
  const hh = (dt.getHours() + '').padStart(2,'0');
  const mm = (dt.getMinutes() + '').padStart(2,'0');
  const ss = (dt.getSeconds() + '').padStart(2,'0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
