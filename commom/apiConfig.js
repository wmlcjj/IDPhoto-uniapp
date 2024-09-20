let DOMAIN = 'https://h5.junjia-teach.com'
let BASE_URL = ''
let BASE_WEB_URL = 'https://h5.junjia-teach.com'

if (process.env.NODE_ENV == 'development') {
	BASE_URL = 'http://127.0.0.1:8010' // 开发环境
	BASE_WEB_URL = 'http://localhost:8080' // 开发环境
} else {
	BASE_URL = DOMAIN + "/idPhoto-server" // 生产环境
}
let staticDomainURL = BASE_URL+ '/sys/common/static';
	
module.exports = {
	domain: DOMAIN,
	baseUrl: BASE_URL, 
	baseWebUrl: BASE_WEB_URL,
	staticDomainURL: staticDomainURL
}
