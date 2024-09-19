<template>
    <view class="methods">
        <view class="block">
            <view class="title">衣服选择</view>
            <view class="cont">
                <view class="left">
                    <image src="/static/pages/methods/images/1.png" style="width: 100%; height: 100%"></image>
                </view>
                <view class="right">
                    <view class="msg">选择能够使脖子显得修长的领子，优先推荐V领，尽量不选择圆领</view>
                    <view class="msg">穿衬衣，应该解开第一个扣子使脖子部分露出多一些</view>
                    <view class="msg">简单干净，避免花里胡哨</view>
                </view>
            </view>
        </view>
        <view class="block">
            <view class="title">造型选择</view>
            <view class="cont">
                <view class="left">
                    <image src="/static/pages/methods/images/2.png" style="width: 100%; height: 100%"></image>
                </view>
                <view class="right">
                    <view class="msg">妆容一定要简单自然大方，拒绝浓妆艳抹</view>
                    <view class="msg">发型以自然清爽为主</view>
                    <view class="msg">可以选择丸子头，高马尾或者普通直发等</view>
                </view>
            </view>
        </view>
        <view class="block">
            <view class="title">拍照技巧</view>
            <view class="cont">
                <view class="left">
                    <image src="/static/pages/methods/images/3.png" style="width: 100%; height: 100%"></image>
                </view>
                <view class="right">
                    <view class="msg">微微抬起眼睛，看镜头上方3cm的地方，显得眼睛又大又有神</view>
                    <view class="msg">按快门的时候，深呼吸，会使脖子肌肉与锁骨的线条变得好看</view>
                    <view class="msg">藏住双下巴，稍微仰头，收紧肩胛骨</view>
                </view>
            </view>
        </view>

        <view class="bottom">
            <view class="left-line"></view>
            <text @tap="navigateTo" data-url="/pages/sizeList/index">去试试</text>
            <view class="right-line"></view>
        </view>
    </view>
</template>

<script>
// pages/methods/index.js
export default {
    data() {
        return {};
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {},
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
        }
    }
};
</script>
<style>
.block {
    margin: 20px 20px 0 20px;
    height: 190px;
    background-color: #fff;
    border-radius: 15px;
    color: #2c2c2c;
    padding-top: 6px;
}

.msg {
    display: flex;
    align-items: flex-start;
    line-height: 22px;
    font-size: 14px;
}

.title {
    font-size: 16px;
    font-weight: 500;
    margin: 10px 0 10px 20px;
}

.cont {
    display: flex;
    width: 100%;
    align-items: center;
}

.left {
    height: 130px;
    margin: 0 10px 0 10px;
    width: 30%;
}

.right {
    width: 70%;
    height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.bottom {
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    color: #165dff;
}

.left-line {
    background: linear-gradient(to left, #165dff, #fff);
    height: 1px;
    width: 100px;
    margin-right: 5px;
}

.right-line {
    background: linear-gradient(to left, #fff, #165dff);
    height: 1px;
    width: 100px;
    margin-left: 5px;
}
</style>
