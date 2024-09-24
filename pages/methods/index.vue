<template>
    <view class="methods">
        <!-- 衣服选择模块 -->
        <view class="block">
            <view class="title">衣服选择</view>
            <view class="cont">
                <view class="left">
                    <image src="/static/pages/methods/images/1.png" class="image" mode="widthFix"></image>
                </view>
                <view class="right">
                    <view class="msg">选择能够使脖子显得修长的领子，优先推荐V领，尽量不选择圆领。</view>
                    <view class="msg">穿衬衣，应该解开第一个扣子使脖子部分露出多一些。</view>
                    <view class="msg">简单干净，避免花里胡哨。</view>
                </view>
            </view>
        </view>

        <!-- 造型选择模块 -->
        <view class="block">
            <view class="title">造型选择</view>
            <view class="cont">
                <view class="left">
                    <image src="/static/pages/methods/images/2.png" class="image" mode="widthFix"></image>
                </view>
                <view class="right">
                    <view class="msg">妆容一定要简单自然大方，拒绝浓妆艳抹。</view>
                    <view class="msg">发型以自然清爽为主。</view>
                    <view class="msg">可以选择丸子头、高马尾或者普通直发等。</view>
                </view>
            </view>
        </view>

        <!-- 拍照技巧模块 -->
        <view class="block">
            <view class="title">拍照技巧</view>
            <view class="cont">
                <view class="left">
                    <image src="/static/pages/methods/images/3.png" class="image" mode="widthFix"></image>
                </view>
                <view class="right">
                    <view class="msg">微微抬起眼睛，看镜头上方3cm的地方，显得眼睛又大又有神。</view>
                    <view class="msg">按快门的时候，深呼吸，会使脖子肌肉与锁骨的线条变得好看。</view>
                    <view class="msg">藏住双下巴，稍微仰头，收紧肩胛骨。</view>
                </view>
            </view>
        </view>

        <!-- 底部按钮 -->
        <view class="bottom">
            <view class="left-line"></view>
            <text @tap="navigateTo" data-url="/pages/sizeList/index" class="navigate-button">去试试</text>
            <view class="right-line"></view>
        </view>
    </view>
</template>

<script>
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
/* 页面整体样式 */
.methods {
    padding: 20px;
    background-color: #f5f5f5;
}

/* 每个模块的卡片样式 */
.block {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
    padding: 15px;
}

/* 标题样式 */
.title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

/* 内容容器样式 */
.cont {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 左侧图片样式 */
.left {
    flex-shrink: 0; /* 防止图片被压缩 */
    width: 120px; /* 固定图片宽度 */
    height: auto;
}

.image {
    width: 100%;
    height: auto;
    object-fit: contain; /* 确保图片按比例缩放 */
}

/* 右侧文本区域样式 */
.right {
    flex-grow: 1;
    padding-left: 20px;
}

.msg {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 10px;
}

/* 底部按钮样式 */
.bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    color: #2c2c2c;
}

.left-line {
    background: linear-gradient(to left, #2c2c2c, #fff);
    height: 1px;
    width: 80px;
    margin-right: 10px;
}

.right-line {
    background: linear-gradient(to right, #2c2c2c, #fff);
    height: 1px;
    width: 80px;
    margin-left: 10px;
}

.navigate-button {
    font-size: 16px;
    color: #2c2c2c;
    cursor: pointer;
    font-weight: bold;
    transition: color 0.3s ease;
}

.navigate-button:hover {
    color: #2c2c2c;
}
</style>
