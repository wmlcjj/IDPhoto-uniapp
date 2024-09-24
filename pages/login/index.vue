<template>
		<view class="cont">
		   <view class="cont-img">
				<image src="/static/images/bg_login.png" mode="aspectFill" class="bg-image"></image>
			</view>
	
			<view class="cont-button">
				<view class="logo-block">
					<view class="logo">
						<view>证件照伴侣</view>
						<view>您身边的证件照管家</view>
					</view>
				</view>
				<view class="but-wh">
					<button @tap="tryLogin" class="button">快捷登录</button>
				</view>
			</view>
		</view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
			wechatXcxUrl: 'wechat/xcx/login',
			userInfo:{
				headimgurl:'',
				nickname:'',
				province:'',
				city:'',
				sex:'',
			},
			wechatH5Url: 'wechat/h5/login',
			scop: 'snsapi_base',
		};
    },
    onLoad(option) {
		let token = option.token
		if(option.isExtendNull && option.isExtendNull == 1){
			this.scop = 'snsapi_userinfo'
			this.tryLogin()
		}else if(token){
			uni.setStorageSync("token", token)
			let from = option.from ? option.from : '/pages/home/index'
			uni.switchTab({
				url: from
			});
		}
    },
    methods: {
		tryLogin(){
			let that = this
			uni.showLoading({
			    title: '登录中...'
			});
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					that.loginXcx(loginRes.code)
				}
			});
			// #endif
			
			// #ifdef H5
			if(!this.$util.isWeiXinBrowser()){
				uni.showToast({
					title: '请在微信浏览器下打开',
					icon: 'none'
				})
				return
			}
			this.loginH5()
			// #endif
		},
		// #ifdef H5
		loginH5(jumpUrl){
			if(!jumpUrl){
				jumpUrl = this.$apiConfig.baseWebURL + "/pages/login/index"
			}
			if(jumpUrl.indexOf("/pages") === 0){
				jumpUrl = config.baseWebUrl + jumpUrl
			}
			let scop = this.scop ? this.scop : 'snsapi_base'
			let appId = this.$apiConfig.appId
			let redirect_uri = this.$apiConfig.apiURL + "/" + this.wechatH5Url + '?appid='+ appId +'&jumpUrl=' + encodeURIComponent(jumpUrl)
			redirect_uri = encodeURIComponent(redirect_uri)
			let wxAuthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId 
			+'&redirect_uri='+ redirect_uri 
			+'&response_type=code&scope='+ scop 
			+'&state='+ scop 
			+'#wechat_redirect'
			window.location.href=wxAuthUrl;
		},
		// #endif
		
		// #ifdef MP-WEIXIN
		//授权登陆（小程序）
		loginXcx(code){
			let that = this
			let appId = this.$apiConfig.appId
			this.userInfo.appId = appId
			this.userInfo.code = code
			this.$http.request({
			    url: this.wechatXcxUrl,
			    data: this.userInfo,
			    method: 'POST',
			}).then(res => {
				uni.hideLoading();
					uni.setStorageSync('token', res.data.data.token);
					uni.navigateBack({
						delta: 1
					});
			});
		},
		//获取用户扩展属性（小程序）
        getExtendXcx() {
			let that = this
            uni.showLoading({
                title: '登录中...'
            });
			uni.getUserProfile({
				lang: 'zh_CN',
				desc: "用户登陆",
				success: (res) => {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							that.userInfo.province = res.userInfo.province;
							that.userInfo.city = res.userInfo.city;
							that.userInfo.sex = res.userInfo.gender;
							that.loginXcx(loginRes.code)
							uni.setStorageSync('wxuserinfo', res)
						}
					});
				},
				fail: res => {
					console.warn(res)
					let _this = this
					uni.showModal({
						title: '系统提示',
						content: '系统想要获取用户信息，请点击按钮马上登陆！',
						confirmText: '马上登陆',
						success: function(res) {
							if (res.confirm) {
								_this.noempower()
							} else if (res.cancel) {
								uni.showToast({
									title:'用户拒绝授权'
								})
							}
						},
					})
				}
			})
        },
		// #endif
		
    }
};
</script>
<style>
.cont {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.cont-img {
    width: 100%;
    height: 100%;
    position: relative;
}

.bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cont-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    flex-direction: column;
}

.cont-dialog {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    flex-direction: column;
}

.logo-block {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

.logo {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
}

.logo view:first-child {
    font-size: 60rpx;
    font-weight: bold;
    color: #333;
}

.logo view:last-child {
    margin-top: 16rpx;
    font-size: 36rpx;
    color: #666;
}

.but-wh {
    margin-top: 40rpx;
}

.button {
    width: 70vw;
    height: 88rpx;
    background: #2c2c2c;
    color: white;
    font-size: 30rpx;
    line-height: 88rpx;
    border-radius: 50rpx;
}
</style>
