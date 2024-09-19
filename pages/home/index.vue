<template>
    <view class="home-page">
        <view class="swiper-component">
            <swiper class="swiper-content" :indicator-dots="true" :autoplay="autoplay" :interval="interval" :duration="duration">
                <block v-for="(item, index) in swiperDatas" :key="index">
                    <swiper-item>
                        <image :src="item.imgurl" class="slide-image" />
                    </swiper-item>
                </block>
            </swiper>
        </view>
        <view class="content">
            <view class="top">
                <view class="top-block">
                    <view class="top-left">
                        <image
                            style="width: 65px; height: 70px; margin-bottom: 5px"
                            src="/static/images/home/methods.png"
                            @tap="navigateTo"
                            data-url="/pages/methods/index"
                        ></image>
                        <view @tap="navigateTo" data-url="/pages/methods/index">查看攻略</view>
                    </view>
                    <view class="top-line"></view>
                    <view class="top-right">
                        <image style="width: 45px; height: 65px; margin-bottom: 5px" src="/static/images/home/build.png" @tap="navigateTo" data-url="/pages/sizeList/index"></image>
                        <view @tap="navigateTo" data-url="/pages/sizeList/index">快速制作</view>
                    </view>
                </view>
            </view>
            <view class="bottom">
                <view class="bottom-block">
                    <view class="bottom-cell">
                        <image style="width: 30px; height: 30px; margin-right: 5px" src="/static/images/home/hot.png" @tap="navigateTo" data-url="/pages/sizeList/index"></image>
                        <view @tap="navigateTo" data-url="/pages/sizeList/index">
                            <view>热门推荐</view>
                            <view>近期高频尺寸</view>
                        </view>
                    </view>
                    <view class="bottom-line"></view>
                    <view class="bottom-cell">
                        <image style="width: 30px; height: 30px; margin-right: 5px" src="/static/images/home/custom.png"></image>
                        <view @tap="navigateTo" data-url="/pages/custom/index">
                            <view>自定义</view>
                            <view>多种尺寸制作</view>
                        </view>
                    </view>
                    <view class="bottom-line"></view>
                    <view class="bottom-cell">
                        <image style="width: 30px; height: 30px; margin-right: 5px" src="/static/images/home/search.png" @tap="navigateTo" data-url="/pages/searchs/index"></image>
                        <view @tap="navigateTo" data-url="/pages/searchs/index">
                            <view>搜索</view>
                            <view>关键字查找</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="my-photo" @tap="navigateTo" data-url="/pages/works/index">
            <view>
                <image style="width: 25px; height: 20px; margin: 0 10px 0 15px" src="/static/images/home/my-photo.png"></image>
                <view>我的作品</view>
            </view>
            <view style="margin-right: 15px; font-size: 25rpx; color: #ccc">
                立即查看
                <uni-icons type="star"></uni-icons>
            </view>
        </view>
        <view class="other">
            <view class="other-title">探索系列</view>

            <view class="other-content">
                <view class="other-block">
                    <image class="other-img" @tap="navigateTo" data-url="/pages/sizeList/index" src="/static/images/home/3.png"></image>
                    <view class="other-msg">AI证件照</view>
                    <view class="other-msg2">支持多种尺寸+自定义背景</view>
                </view>
            </view>

            <view class="other-content">
                <view class="other-block">
                    <image class="other-img" @tap="toBeLaunched" src="/static/images/home/4.png"></image>
                    <view class="other-msg">人像抠图</view>
                    <view class="other-msg2">智能识别人像，一键迅捷抠图</view>
                </view>
            </view>

            <view class="other-content">
                <view class="other-block">
                    <image class="other-img" @tap="toBeLaunched" src="/static/images/home/5.png"></image>
                    <view class="other-msg">黑白照片上色</view>
                    <view class="other-msg2">黑白照片一键上色变清晰</view>
                </view>
            </view>

            <view class="other-content">
                <view class="other-block">
                    <image class="other-img" @tap="toBeLaunched" src="/static/images/home/6.png"></image>
                    <view class="other-msg">粘土风写真</view>
                    <view class="other-msg2">又丑又萌的粘土风格照片</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            //轮播图配置
            autoplay: true,
            interval: 3000,
            duration: 1200,
            swiperDatas: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        const that = this;
        const data = {
            swiperDatas: [
                {
                    id: 1,
                    imgurl: '/static/images/home/1.png'
                },
                {
                    id: 2,
                    imgurl: '/static/images/home/2.png'
                }
            ]
        };
		that.swiperDatas = data.swiperDatas
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    methods: {
        // 路由跳转
        navigateTo(e) {
            uni.navigateTo({
                url: e.currentTarget.dataset.url
            });
        },

        //即将上线项目弹出
        toBeLaunched() {
            uni.showToast({
                title: '该功能正在内测中，即将开放',
                icon: 'none',
                duration: 5000
            });
        }
    }
};
</script>
<style>
/* 轮博图样式 */
.swiper-component {
    width: 100%;
    height: 60vh;
}

.swiper-content {
    width: 100%;
    height: 100%;
}

.slide-image {
    width: 100%;
    height: 100%;
}

/* 内容区域 */
.content {
    width: 90%;
    height: 400rpx;
    background-color: #fff;
    margin: 0 auto;
    border-radius: 30rpx;
    position: relative;
    top: -100rpx;
    box-shadow: 0px 5px 8px #ccc;
}

.top {
    height: 65%;
    border-bottom: 1rpx solid #eee;
}

.top-block {
    height: 100%;
    display: flex;
    align-items: center;
}

.top-left {
    width: 33.333%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-weight: 500;
}

.top-line {
    height: 80%;
    border: 1rpx solid #eee;
}

.top-right {
    width: 66.666%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-weight: 500;
}

.bottom {
    height: 35%;
    /* background-color: #0f0; */
    border-radius: 40rpx;
}

.bottom-block {
    height: 100%;
    display: flex;
    align-items: center;
}

.bottom-line {
    height: 70%;
    border: 1rpx solid #eee;
}

.bottom-cell {
    width: 33.3%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20rpx;
}

.bottom-cell > view view:last-child {
    font-size: 18rpx;
    color: #ccc;
}

.my-photo {
    width: 90%;
    height: 100rpx;
    background-color: #fff;
    margin: 0 auto;
    border-radius: 30rpx;
    position: relative;
    top: -70rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.my-photo view:first-child {
    display: flex;
    align-items: center;
    font-size: 14px;
}

.other {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
    top: -40rpx;
    padding: 20px 0;
}

.other-title {
    font-weight: 500;
    margin-left: 20px;
}

.other-content {
    display: flex;
}

.other-content .other-block:first-child {
    height: 250px;
    width: 50%;
    margin: 20px 20px 0 20px;
    background-color: #000;
    border-radius: 15px;
}

.other-content .other-block:last-child {
    height: 250px;
    width: 93%;
    margin: 20px 20px 5px 22px;
    background-color: #30323c;
    border-radius: 15px;
}

.other-block {
    position: relative;
}

.other-img {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    border-radius: 15px;
}

.other-msg {
    height: 20%;
    position: absolute;
    font-size: 14px;
    color: #fff;
    left: 8px;
    bottom: 0;
}

.other-msg2 {
    height: 11%;
    position: absolute;
    font-size: 14px;
    color: #fff;
    left: 8px;
    bottom: 0;
}
</style>
