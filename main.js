import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

import { http } from '@/commom/service.js' // 全局挂载引入，配置相关在该index.js文件里修改
import apiConfig from '@/commom/apiConfig.js' // 全局挂载引入，配置相关在该index.js文件里修改
Vue.prototype.$http = http
Vue.prototype.$apiConfig = apiConfig

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif