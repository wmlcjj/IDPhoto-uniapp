<template>
	<!-- pages/custom/index.wxml -->
	<view class="custom">
		<view class="size">
			<view class="size-item">
				<uni-easyinput :value="name" :clearable="false" focus placeholder="请输入名称" @input="changeName"></uni-easyinput>
			</view>
			<view class="size-item">
				<uni-easyinput :value="width" type="number" :clearable="false" focus placeholder="请输入宽度" @input="changeWidth"></uni-easyinput>
			</view>
			<view class="size-item">
				<uni-easyinput :value="height" type="number" :clearable="false" focus placeholder="请输入高度" @input="changeHeight"></uni-easyinput>
			</view>
			<view class="size-item">
				<uni-easyinput :value="size + ' mm'" :disabled="true" ></uni-easyinput>
			</view>
			<view class="size-item">
				<uni-easyinput :value="px" :disabled="true"></uni-easyinput>
			</view>
		</view>
		<view class="bottom">
			<button @tap="addSize" class="">保存尺寸</button>
		</view>
	</view>
</template>

<script>
import tool from './util';
const app = getApp();
export default {
    data() {
        return {
            width: undefined,
            height: undefined,
            name: '',
            px: '295*413 px',
            size: '25*35'
        };
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
        changeName: tool.debounce(function (e) {
            if (e[0]) {
                this.name = e[0]
            }
        }, 500),

        changeWidth: tool.debounce(function (e) {
            if (e[0]) {
                this.width = Number(e[0])
                this.px = `${Number(e[0])}*${this.height} px`
                this.size = `${Math.floor(Number(e[0]) / 11.8)}*${Math.floor(this.height / 11.8)}`
            }
        }, 500),

        changeHeight: tool.debounce(function (e) {
            if (e[0]) {
                this.height = Number(e[0])
                this.px = `${this.width}*${Number(e[0])} px`
                this.size = `${Math.floor(this.width / 11.8)}*${Math.floor(Number(e[0]) / 11.8)}`
            }
        }, 500),

        addSize() {
            if (!uni.getStorageSync("token")) {
                uni.navigateTo({
                    url: '/pages/login/index'
                });
            }
            if (this.width == 0 || this.height == 0) {
                uni.showToast({
                    title: '宽或高不能为0',
                    icon: 'error',
                    duration: 2000,
                    mask: true
                });
                return;
            }
            if (this.name == '') {
                uni.showToast({
                    title: '名字为必填',
                    icon: 'error',
                    duration: 2000,
                    mask: true
                });
                return;
            }
            if (!this.isNull(this)) {
                uni.showToast({
                    title: '不能有特殊符号',
                    icon: 'error',
                    duration: 2000,
                    mask: true
                });
            } else {
                this.$http.request({
                    url: 'item/saveCustom',
                    method: 'POST',
                    data: {
                        name: this.name,
                        widthPx: this.width,
                        heightPx: this.height,
                        size: this.size
                    }
                }).then(res => {
					uni.showToast({
						title: '定制成功',
						duration: 2000,
						mask: true
					});
				});
            }
        },

        isNull() {
            const { width, height, name } = this;
            const reg = /^\d+$/;
            if (!name || !reg.test(width) || !reg.test(height)) {
                return false;
            } else {
                return true;
            }
        }
    }
};
</script>
<style>
/* pages/custom/index.wxss */
.custom {
    height: 100vh;
    background-color: #fff;
}

.size {
    width: 70vw;
    height: 30vh;
    margin: 0 auto;
    /* margin: 0 70px; */
    margin-top: 20vh;
    color: #2c2c2c !important;
}

.size-item {
    margin-top: 20px;
}

.van-field__label {
    font-size: 18px;
}

.bottom {
    margin: 100px auto;
}

.bottom button:first-child {
    margin: 0 70px;
    height: 45px;
    color: #fff;
    background-color: #2c2c2c;
    border-radius: 10px;
    font-size: 18px;
    text-align: center;
    line-height: 45px;
}
</style>
