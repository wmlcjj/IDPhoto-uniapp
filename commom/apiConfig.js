let DOMAIN = 'https://h5.junjia-teach.com'
let API_URL = ''
let BASE_WEB_URL = 'https://h5.junjia-teach.com'
// #ifdef H5
let appId = 'wxabd37d337b0800bc'
// #endif
// #ifdef MP-WEIXIN
let appId = uni.getAccountInfoSync().miniProgram.appId
// #endif


if (process.env.NODE_ENV == 'development') {
	API_URL = DOMAIN + "/idPhoto-server" // 生产环境
	// API_URL = 'http://127.0.0.1:8010' // 开发环境
	// API_URL = 'http://ffq4b6.natappfree.cc' // 开发环境
	BASE_WEB_URL = 'http://localhost:8080' // 开发环境
} else {
	API_URL = DOMAIN + "/idPhoto-server" // 生产环境
}
let staticDomainURL = API_URL+ '/sys/common/static';
	
module.exports = {
	domain: DOMAIN,
	apiURL: API_URL, 
	baseWebURL: BASE_WEB_URL,
	staticDomainURL: staticDomainURL,
	appId: appId
}
