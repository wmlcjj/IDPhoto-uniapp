<template>
    <view class="container">
        <view class="container-content">
            <view class="container-content-img">
                <image @tap="preView" mode="heightFix" :src="url"></image>
            </view>
            <view class="img-msg">
                {{ msg }}
            </view>
        </view>
        <view class="bottom">
            <button open-type="share">分享给朋友</button>
            <button @tap="goHome" class="">返回首页</button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            msg: '',
            tempFilePath: '',
            url: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        this.msg = options.msg
        this.tempFilePath = options.tempFilePath
        this.url = options.url
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
        preView() {
            uni.previewImage({
                urls: [this.url],
                current: this.url
            });
        },

        // 跳转到首页
        goHome() {
            uni.reLaunch({
                url: '/pages/home/index'
            });
        }
    }
};
</script>
<style>
/* pages/edit/complete/index.wxss */
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    background-color: #fff;
}

.container-content {
    width: 100%;
    /* height: 100%; */
    margin-top: 10vh;
}

.container-content-img {
    margin: 50rpx 0;
    display: flex;
    justify-content: center;
}

.img-msg {
    text-align: center;
    font-size: 12px;
    color: #ddd;
}

.msg {
    margin-top: 50rpx;
    text-align: center;
}

.icon_complete {
    font-size: 80rpx;
    color: #2c2c22;
}

.bottom {
    margin: 0 auto;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 40px;
}

.bottom button:first-child {
    width: 40%;
    height: 55px;
    margin-left: 30px;
    background-color: #eee;
    border-radius: 10px;
    font-size: 18px;
    text-align: center;
    line-height: 55px;
}

.bottom button:last-child {
    width: 40%;
    height: 55px;
    margin-right: 30px;
    background-color: #2c2c2c;
    border-radius: 10px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 55px;
}
</style>
