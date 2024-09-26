let DOMAIN = '接口地址'
let API_URL = ''
let BASE_WEB_URL = '页面地址'
// #ifdef H5
let appId = '微信公众号appId'
// #endif
// #ifdef MP-WEIXIN
let appId = uni.getAccountInfoSync().miniProgram.appId
// #endif


if (process.env.NODE_ENV == 'development') {
	// API_URL = DOMAIN // 生产环境
	API_URL = 'http://127.0.0.1:8010' // 开发环境
	BASE_WEB_URL = 'http://localhost:8080' // 开发环境
} else {
	API_URL = DOMAIN // 生产环境
}
let staticDomainURL = API_URL+ '/sys/common/static';
	
module.exports = {
	domain: DOMAIN,
	apiURL: API_URL, 
	baseWebURL: BASE_WEB_URL,
	staticDomainURL: staticDomainURL,
	appId: appId
}
