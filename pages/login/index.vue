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
                <button @tap="noempower" class="button">快捷登录</button>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {};
    },
    onLoad() {},
    methods: {
        noempower() {
            uni.showLoading({
                title: '登录中...'
            });
            uni.login({
                success(res) {
                    uni.request({
                        url: app.globalData.url + 'user/login',
                        data: {
                            code: res.code
                        },
                        method: 'GET',
                        success(res) {
                            uni.hideLoading();
                            if (res.data.code == 200) {
                                app.globalData.token = res.data.data.token;
                                uni.navigateBack({
                                    delta: 1
                                });
                            } else {
                                uni.showToast({
                                    title: '登录失败,当前系统维护中...',
                                    icon: 'none'
                                });
                            }

                            //   wx.navigateTo({
                            //     url: "pages/home/index",
                            // })
                        }
                    });
                }
            });
        }
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
