/**
 * @version 3.0.5
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 */

import Request from '@/utils/luch-request/index.js'
import apiConfig from './apiConfig'

const getTokenStorage = () => {
  let token = ''
  try {
    token = uni.getStorageSync('token')
  } catch (e) {
  }
  return token
}

const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
  config.baseURL = apiConfig.baseUrl /* 根域名不同 */
  config.header = {
    ...config.header,
  }
  return config
})


http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
  config.header = {
    ...config.header,
    token: getTokenStorage()
  }
  /*
 if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
   return Promise.reject(config)
 }
 */
  return config
}, (config) => {
  return Promise.reject(config)
})


http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
  if (response.data && response.data.code == 401) { // 401,未登录，直接跳转登陆界面
	uni.navigateTo({
		url: '/pages/login/index'
	});
  }
  return response
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
  console.log(response)
  return Promise.reject(response)
})

export {
  http
}
