import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import '../public/css/index.css'

import format from 'date-fns/format'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueQuillEditor, /* { default global options } */)

//自定义过滤器
Vue.filter('date-format',(value,formats='yyyy-MM-dd HH:mm:ss') => {
  return format(value,formats)
})

import axios from 'axios'

import TreeTable  from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)
//配置默认的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//添加请求拦截器  在请求拦截器中 展示进度条 NProgress.start();
axios.interceptors.request.use(config => {
  NProgress.start();
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//在响应拦截器中 添加进度结束条 NProgress.done();
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
