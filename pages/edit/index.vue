<template>
    <view class="container">
        <view class="photo-edit-content">
            <view class="canvas-view" style="background-color: #fff; width: 240px; height: 336px">
                <image
                    class="nowx_mask"
                    style="width: 292px; left: 120px; top: 164px; transform: translate(-50%, -50%) scale(1) rotate(0deg); z-index: 99; height: 163.52px"
                    src="/static/images/wmark.png"
                    mode="widthFix"
                ></image>
                <image
                    style="width: 240px; height: 336px; left: 120px; top: 164px; transform: translate(-50%, -50%) scale(1) rotate(0deg)"
                    class="people-photo"
                    :src="imageData.cimg"
                    @load="bindload"
                    @touchstart.stop.prevent="touchstart"
                    @touchmove.stop.prevent="touchmove"
                    @touchend.stop.prevent="touchend"
                ></image>
            </view>
        </view>
        <view class="imgOpt">
			<uni-segmented-control :current="current" :values="items" style-type="text"
				active-color="#2c2c2c" @clickItem="clickTab" />
			<view>
				<view class="colors">
					<!-- 蓝色背景 -->
					<view @tap="toggleBg" data-color="#438edb" class="color" style="background-color: #438edb">
						<view class="icon_select"></view>
					</view>
					<!-- 白色背景 -->
					<view @tap="toggleBg" data-color="#fff" class="color" style="background-color: #fff">
						<view class="icon_select"></view>
					</view>
					<!-- 红色背景 -->
					<view @tap="toggleBg" data-color="#ff0000" class="color" style="background-color: #ff0000">
						<view class="icon_select"></view>
					</view>
					<!-- 浅蓝色背景 -->
					<view @tap="toggleBg" data-color="#66b5f2" class="color" style="background-color: #66b5f2">
						<view class="icon_select"></view>
					</view>
					<!-- 绿色背景 -->
					<view @tap="toggleBg" data-color="#07c160" class="color" style="background-color: #07c160">
						<view class="icon_select"></view>
					</view>
					<!-- 黄色背景 -->
					<view @tap="toggleBg" data-color="#ffc300" class="color" style="background-color: #ffc300">
						<view class="icon_select"></view>
					</view>
					<!-- 自定义颜色选项 -->
					<view @tap="toPick" data-color="custom" class="color custom" style="display: flex; align-items: center; justify-content: center">
						<view
							class="custom-bg"
							style="background-color: #2c2c2c; width: 100%; height: 100%; font-size: 12px; color: #fff; margin: 0 auto; line-height: 12vw; text-align: center"
						>
							自定义
						</view>
					</view>
				</view>
			</view>
            <view class="download-view">
                <button @tap="saveNormalPhoto" type="default" class="save-btn">保存预览照</button>
                <button @tap="saveHDPhoto" type="default" class="save-btn">保存AI高清照</button>
            </view>

            <color-picker @changeColor="pickColor" initColor="rgb(7,193,96)" :show="pick" />
        </view>
    </view>
</template>

<script>
	
import colorPicker from '../../components/color-picker/color-picker';
const app = getApp();
let canOnePointMove = false;
let onePoint = {
    x: 0,
    y: 0
};
let twoPoint = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
};
export default {
    components: {
        colorPicker
    },
    data() {
        return {
			items: ['背景'],
            imageData: {
                cimg: ''
            },

            showScale: 1.6271186440677967,
            rpxRatio: 1,
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            scale: 1,
            rotate: 0,
            bgc: '#ffffff',
            maskLeft: 0,
            maskTop: 0,
            maskScale: 1,
            maskRotate: 0,
            pick: false,
            color: '438edb',
            picUrl: '',

            // downloadOne:1,
            // downloadTwo:2
            picId: '',

            downloadOne: '',
            downloadTwo: '',
            current: ''
        };
    },
    onLoad: function (options) {
        this.getImageData();
        this.setRpxRatio();
        // this.getWeb();
    },
    methods: {
        getImageData() {
            const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
            if (eventChannel) {
                eventChannel.on('sendImageData', (data) => {
                    this.imageData = data
                    console.log(this);
                    uni.setNavigationBarTitle({
                        title: this.imageData.name + '（预览）'
                    });
                });
            }
        },

        setRpxRatio() {
            uni.getWindowInfo({
                success: (res) => {
                    this.rpxRatio = res.screenWidth / 750
                }
            });
        },

        getWeb() {
            uni.request({
                url: app.globalData.url + 'api/getWeb',
                header: {
                    token: app.globalData.token
                },
                method: 'POST',
                success: (res) => {
                    this.downloadOne = res.data.downloadOne
                    this.downloadTwo = res.data.downloadTwo
                }
            });
        },

        // 点击换背景
        toggleBg(e) {
            uni.showLoading({
                title: '制作中...'
            });
            this.color = e.currentTarget.dataset.color
            console.log(e.currentTarget.dataset.color);
            this.updateColor(this.color, this.imageData.kimg);
        },

        toPick: function () {
            this.pick = true
        },

        //自定义换背景
        pickColor(e) {
            uni.showLoading({
                title: '制作中...'
            });
            let color = this.rgbStringToHex(e.detail.color);
            this.color = color
            this.updateColor(color, this.imageData.kimg);
        },

        //调用换背景
        updateColor(color, tu) {
            uni.request({
                url: app.globalData.url + 'api/updateIdPhoto',
                data: {
                    image: tu,
                    colors: color
                },
                header: {
                    token: app.globalData.token
                },
                method: 'POST',
                success: (res) => {
                    if (res.data.code == 200) {
                        this.imageData.cimg = res.data.data.cimg
                        uni.hideLoading();
                    } else if (res.data.code == 404) {
                        uni.hideLoading();
                        uni.showToast({
                            title: res.data.data,
                            icon: 'error'
                        });
                    }
                }
            });
        },

        //保存证件照
        saveNormalPhoto() {
            uni.showLoading({
                title: '下载中...'
            });
            uni.request({
                url: app.globalData.url + 'api/updateUserPhonto',
                data: {
                    image: this.imageData.cimg,
                    photoId: this.imageData.id2
                },
                header: {
                    token: app.globalData.token
                },
                method: 'POST',
                success: (res) => {
                    if (res.data.code == 200) {
                        this.picUrl = res.data.data.picUrl
                        this.picId = res.data.data.picId
                        this.savePicAndImg();
                    } else if (res.data.code == 404) {
                        uni.showToast({
                            title: res.data.data,
                            icon: 'none'
                        });
                    }
                }
            });
        },

        //保存高清照
        saveHDPhoto() {
            this.picUrl = ''
            this.updateColor(this.color, this.imageData.oimg);
            this.$nextTick(() => {
                this.saveNormalPhoto();
            });
        },

        savePicAndImg() {
            //调用保存
            if (this.picId) {
                this.savePicIdAndImg();
            } else {
                this.savePicUrlAndImg();
            }
        },

        // 根据图片url下载保存
        savePicUrlAndImg() {
            const that = this;
            uni.downloadFile({
                url: this.picUrl,
                success: function (res) {
                    uni.hideLoading();
                    // 下载成功后将图片保存到本地
                    uni.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            uni.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                            });
                        },
                        fail: function () {
                            that.checkq(); //解决用户拒绝相册
                        }
                    });
                },

                fail: function (res) {
                    console.log(res);
                    uni.showToast({
                        title: '下载图片失败，请重试',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },

        // 根据图片id下载保存
        savePicIdAndImg() {
            const that = this;
            uni.downloadFile({
                url: app.globalData.url + 'file/download?id=' + this.picId,
                success: function (res) {
                    uni.hideLoading();
                    // 下载成功后将图片保存到本地
                    uni.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            uni.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                            });
                        },
                        fail: function () {
                            that.checkq(); //解决用户拒绝相册
                        }
                    });
                },

                fail: function (res) {
                    console.log(res);
                    uni.showToast({
                        title: '下载图片失败，请重试',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },

        // 解决用户拒绝相册问题
        checkq() {
            uni.getSetting({
                success: (res) => {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        uni.showModal({
                            title: '提示',
                            content: '保存图片需要授权哦',
                            success: (res) => {
                                if (res.confirm) {
                                    uni.openSetting({
                                        success: (res) => {
                                            this.savePicAndImg();
                                        },
                                        fail: (res) => {
                                            console.log(res);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        },

        //去分享页面(待开发分享下载)
        async composeImage() {
            uni.showLoading({
                title: '制作中...'
            });
            uni.redirectTo({
                url: './complete/index?msg=111&tempFilePath=pa&url=https://www.haimati.cn/img/1_7_1.98819809.jpg'
            });
        },

        rgbStringToHex(rgbString) {
            // 提取 rgb 值
            const rgbValues = rgbString.match(/\d+/g);

            // 将 rgb 值转换为十六进制
            const r = parseInt(rgbValues[0], 10);
            const g = parseInt(rgbValues[1], 10);
            const b = parseInt(rgbValues[2], 10);
            return '#' + (16777216 + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        },

        bindload: function (e) {
            uni.hideLoading({});
            const { width, height } = e.detail;
            const { widthPx, heightPx } = this.imageData;
            const _width = widthPx;
            const _height = (_width * height) / width;
            const topOffset = uni.getWindowInfo().screenHeight * 0.1;
            this.originImgWidth = width
            this.originImgHeight = height
            this.initImgWidth = _width
			this.initImgHeight = _height
			this.width = _width
			this.height = _height
			this.left = _width / 2
			this.top = _height / 2 + heightPx - _height + topOffset - 86
			this.maskLeft = _width / 2
			this.maskTop = _height / 2 + heightPx - _height + topOffset - 86
        },

        touchstart: function (e) {
            if (e.touches.length < 2) {
                canOnePointMove = true;
                onePoint.x = e.touches[0].pageX * 2;
                onePoint.y = e.touches[0].pageY * 2;
            } else {
                twoPoint.x1 = e.touches[0].pageX * 2;
                twoPoint.y1 = e.touches[0].pageY * 2;
                twoPoint.x2 = e.touches[1].pageX * 2;
                twoPoint.y2 = e.touches[1].pageY * 2;
            }
        },

        touchmove: function (e) {
            const { data } = this;
            const thatData = data;
            if (e.touches.length < 2 && canOnePointMove) {
                // 单指移动
                const onePointDiffX = e.touches[0].pageX * 2 - onePoint.x;
                const onePointDiffY = e.touches[0].pageY * 2 - onePoint.y;
                this.left = thatData.left + onePointDiffX
                this.top = thatData.top + onePointDiffY
                this.maskLeft = thatData.maskLeft + onePointDiffX
                this.maskTop = thatData.maskTop + onePointDiffY
                onePoint.x = e.touches[0].pageX * 2;
                onePoint.y = e.touches[0].pageY * 2;
            } else if (e.touches.length > 1) {
                // 双指缩放/旋转
                const preTwoPoint = JSON.parse(JSON.stringify(twoPoint));
                twoPoint.x1 = e.touches[0].pageX * 2;
                twoPoint.y1 = e.touches[0].pageY * 2;
                twoPoint.x2 = e.touches[1].pageX * 2;
                twoPoint.y2 = e.touches[1].pageY * 2;
                const preAngle = (Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180) / Math.PI;
                const curAngle = (Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180) / Math.PI;
                const preDistance = Math.sqrt(Math.pow(preTwoPoint.x1 - preTwoPoint.x2, 2) + Math.pow(preTwoPoint.y1 - preTwoPoint.y2, 2));
                const curDistance = Math.sqrt(Math.pow(twoPoint.x1 - twoPoint.x2, 2) + Math.pow(twoPoint.y1 - twoPoint.y2, 2));
                const angleThreshold = 0.5;
                const distanceThreshold = 2;
                if (Math.abs(curAngle - preAngle) > angleThreshold || Math.abs(curDistance - preDistance) > distanceThreshold) {
                    const smoothFactor = 0.2;
                    let newScale = thatData.scale + (curDistance - preDistance) * 0.005 * smoothFactor;
                    if (newScale < 0.5) {
                        newScale = 0.5;
                    }
                    this.scale = newScale
                    this.rotate = thatData.rotate + (curAngle - preAngle) * smoothFactor
                    this.maskScale = newScale
                    this.maskRotate = thatData.rotate + (curAngle - preAngle) * smoothFactor
                }
            }
        },

        touchend: function () {
            canOnePointMove = false;
        },

        clickTab() {
            console.log('占位：函数 clickTab 未声明');
        }
    }
};
</script>
<style>
.container {
    width: 100vw;
    height: 90vh;
    overflow: hidden;
    position: relative;
}

.imgOpt {
    width: 100%;
    height: 100%;
    background: #fff;
}

.imgOpt .colors {
    z-index: 20;
    position: relative;
    width: 100%; /* 确保容器宽度为100% */
    display: flex;
    flex-wrap: wrap; /* 确保子元素自动换行 */
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: 10px;
    overflow-x: hidden; /* 禁止横向滚动条 */
    touch-action: pan-y; /* 禁止左右滑动 */
}

.imgOpt .colors .color {
    width: 22%;
    height: 12vw;
    margin: 1%;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-sizing: border-box;
}

.imgOpt .colors .color.transparent {
    background-color: transparent;
    position: relative;
}

.imgOpt .colors .color.transparent::before {
    content: '透明';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    text-align: center;
    color: #333;
    line-height: 1;
    height: 1em;
    margin-top: -0.5em;
    font-size: 14px;
}

/* canvas */
.container .photo-edit-content {
    padding: 5px;
    padding-bottom: 15px;
    width: 100%;
    background: '#e6e2e';
    box-sizing: border-box;
}

.container .photo-edit-content .canvas-view {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 auto;
    box-sizing: content-box;
    overflow: hidden;
}

.container .photo-edit-content .canvas-view .people-photo {
    position: absolute;
    width: 100%;
    transform-origin: center center;
}

.download-view {
    z-index: 10; /* 确保按钮在前 */
    margin: 0 auto;
    width: 90%;
    position: fixed;
    bottom: 10px; /* 调整bottom，避免覆盖颜色选择区域 */
    display: flex;
    justify-content: space-between;
    left: 20px;
    height: 59px;
}

.download-view button {
    background-color: #2c2c2c !important;
    color: #fff !important;
    font-weight: normal;
    height: 50px;
    line-height: 50px;
    width: 48% !important;
    border-radius: 10px;
    margin: 0;
}

/* color picker */
.color-picker-view {
    position: absolute;
    width: 100%;
    overflow: visible;
    z-index: 99;
}

.color-picker-view .color-picker-content {
    height: 55vh;
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.color-picker-view .color-picker-content .current-color {
    width: 100%;
}

.color-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.color-picker-view .color-picker-content button {
    margin: 0 auto;
    background-color: #2c2c2c;
    color: #fff;
    margin-top: 10px;
}

.clothes {
    height: 210px;
    width: 100%;
    padding: 15px 20px;
    display: flex;
    flex-wrap: wrap;
}

.clothes .block:nth-child(2n + 1) {
    width: 27.5%;
    height: 70px;
    margin: 0 15px 15px 0;
}

.clothes .block:nth-child(2n) {
    width: 27.5%;
    height: 70px;
    margin: 0 15px 15px 0;
}

.hair {
    height: 210px;
    width: 100%;
    padding: 15px 20px;
    display: flex;
    flex-wrap: wrap;
}

.hair .block:nth-child(2n + 1) {
    width: 19.3%;
    height: 70px;
    margin: 0 15px 15px 0;
}

.hair .block:nth-child(2n) {
    width: 19.3%;
    height: 70px;
    margin: 0 15px 15px 0;
}

.nowx_mask {
    margin: auto;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
