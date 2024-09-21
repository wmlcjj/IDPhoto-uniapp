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
					<button @tap="tapGetUserProfile" class="button">快捷登录</button>
				</view>
			</view>
			<cui-userprofiledialog ref="userProfileDialog" paddingBottom="92rpx"></cui-userprofiledialog>
		</view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
			userInfo:{
				headimgurl:'',
				nickname:'',
				province:'',
				city:'',
				sex:'',
			}
		};
    },
    onLoad() {},
    methods: {
		tapGetUserProfile() {
			let that = this
			this.$refs["userProfileDialog"].show({
				desc: "用于显示个人资料",
				avatarUrl: {
					requried: true, // 是否必填
					disable: false, // 是否隐藏
				}
			}).then(res => {
				that.userInfo.headimgurl = res.avatarUrl
				that.userInfo.nickname = res.nickName
				that.noempower()
			}, err => {
				console.log("取消")
			});
		},
        noempower() {
			let that = this
            uni.showLoading({
                title: '登录中...'
            });
			uni.getUserProfile({
				lang: 'zh_CN',
				desc: "用户注册",
				success: (res) => {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							that.userInfo.province = res.userInfo.province;
							that.userInfo.city = res.userInfo.city;
							that.userInfo.sex = res.userInfo.gender;
							that.xcxLogin(loginRes.code)
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
		xcxLogin(code){
			var appId = uni.getAccountInfoSync().miniProgram.appId;
			this.userInfo.appId = appId
			this.userInfo.code = code
			this.$http.request({
			    url: 'wechat/wxxcx/login',
			    data: this.userInfo,
			    method: 'POST',
			}).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
				    uni.setStorageSync('token', res.data.data.token);
				    uni.navigateBack({
				        delta: 1
				    });
				} else {
				    uni.showToast({
				        title: '登录失败,当前系统维护中...',
				        icon: 'none'
				    });
				}
				
			});
		},
		
		
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
