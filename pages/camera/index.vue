<template>
    <!-- pages/autoCamera/autoCamera.wxml -->
    <view class="camera">
        <camera v-if="!photoSrc" :device-position="cameraPostion" flash="off" @error="error" style="width: 100%; height: 100%"></camera>
        <view v-else class="contain-photo">
            <image :src="photoSrc"></image>
        </view>
        <view class="person">
            <image mode="scaleToFill" src="/static/images/person.png"></image>
        </view>
        <view v-if="cameraImg">
            <view class="iconfont icon_back" @tap="goBackPhoto">
                <image src="/static/pages/camera/images/back.png" style="width: 100%; height: 100%"></image>
            </view>
            <view class="iconfont icon_confirm" @tap="goEditPhoto">
                <image src="/static/pages/camera/images/go.png" style="width: 100%; height: 100%"></image>
            </view>
        </view>
        <view v-else>
            <view class="iconfont icon_cameraC" @tap="photo">
                <image src="/static/pages/camera/images/camera.png" style="width: 100%; height: 100%"></image>
            </view>
            <view class="iconfont icon_cameraT" @tap="reverseCamera">
                <image src="/static/pages/camera/images/reverse.png" style="width: 100%; height: 100%"></image>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            cameraPostion: 'back',
            cameraImg: false,
            photoSrc: '',
            detail: {}
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        this.getEmitData();
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
        // 接受参数
        getEmitData() {
            const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
            if (eventChannel) {
                eventChannel.on('chooseCamera', (data) => {
                    console.log(data);
                    this.detail = data
                });
            }
        },

        // 反转相机
        reverseCamera() {
            if (this.cameraPostion === 'back') {
                this.cameraPostion = 'front'
                return;
            }
            if (this.cameraPostion === 'front') {
                this.cameraPostion = 'back'
                return;
            }
        },

        // 拍照
        photo() {
            const ctx = uni.createCameraContext();
            ctx.takePhoto({
                quality: 'high',
                success: (res) => {
                    this.photoSrc = res.tempImagePath
                    this.cameraImg = true
                }
            });
        },

        // 去上传抠图编辑
        goEditPhoto() {
            if (this.photoSrc) {
                this.Uploadimg(this.photoSrc);
            }
        },

        // 返回拍照
        goBackPhoto() {
            this.cameraImg = false
            this.photoSrc = ''
        },

        // 上传原图
        Uploadimg(filePath) {
            uni.showLoading({
                title: '图像检测中...'
            });
            const fileSizeMB = filePath.size / 1048576;
            // 检查文件大小
            if (fileSizeMB > 15) {
                uni.showToast({
                    title: '图片太大啦，不能超15M哦',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            this.imgUpload(filePath);
        },

        // 上传原图
        imgUpload(filePath) {
			let that = this
            uni.showLoading({
                title: '图片检测中'
            });
            this.$http.upload('upload',{
                filePath: filePath,
                name: 'file',
                header: {
                    'content-type': 'multipart/form-data',
                },
            }).then(res => {
				uni.hideLoading();
				let data = res.data;
				if (data.code == 200) {
				    that.imageDivision(data.data);
				} else if (data.code == -1) {
				    uni.showToast({
				        title: data.data,
				        icon: 'none'
				    });
				} else {
				    uni.navigateTo({
				        url: '/pages/login/index'
				    });
				}
			});
        },

        imageDivision(tu) {
            uni.showLoading({
                title: '制作中...'
            });
			let that = this
            let type = this.detail.category == 4 ? 0 : 1;
            this.$http.request({
                url: 'api/createIdPhoto',
                data: {
                    image: tu,
                    type: type,
                    itemId: this.detail.id
                },
                method: 'POST',
            }).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
				    that.goEditPage(res.data.data);
				} else if (res.data.code == -1) {
				    console.log(res.data);
				    uni.showToast({
				        title: res.data.data,
				        icon: 'error'
				    });
				} else {
				    uni.navigateTo({
				        url: '/pages/login/index'
				    });
				}
			});
        },

        /**
         * 去编辑页面
         */
        goEditPage(data) {
            const { category, heightMm, heightPx, id, name, widthMm, widthPx } = this.detail;
            uni.navigateTo({
                url: '/pages/edit/index',
                success: function (res) {
                    res.eventChannel.emit('sendImageData', {
                        ...data,
                        category,
                        heightMm,
                        heightPx,
                        id,
                        name,
                        widthMm,
                        widthPx
                    });
                }
            });
        },

        error() {
            console.log('占位：函数 error 未声明');
        }
    }
};
</script>
<style>
/* pages/autoCamera/autoCamera.wxss */
page {
    overflow: hidden;
    height: 100%;
}

.camera {
    position: relative;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
}

.contain-photo {
    width: 100%;
    height: 100%;
}

image {
    width: 100%;
    height: 100%;
}

.person {
    width: 100%;
    height: 100%;
    position: absolute;
    font-size: 150rpx;
    top: 200rpx;
    color: #fff;
}

.person image {
    width: 100%;
    height: 60%;
}

.icon_cameraC {
    width: 150rpx;
    height: 150rpx;
    position: absolute;
    font-size: 150rpx;
    left: 50%;
    margin-left: -75rpx;
    bottom: 50rpx;
    color: #fff;
    /* border-radius: 50%;
  background-color: #fff; */
}

.icon_cameraT {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    font-size: 100rpx;
    right: 30rpx;
    top: 10vh;
    color: #fff;
}

.icon_back {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    font-size: 100rpx;
    left: 70rpx;
    bottom: 50rpx;
    color: #fff;
    /* background-color: #fff; */
}

.icon_confirm {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    font-size: 100rpx;
    right: 70rpx;
    bottom: 50rpx;
    color: #fff;
    /* background-color: #fff; */
}
</style>
