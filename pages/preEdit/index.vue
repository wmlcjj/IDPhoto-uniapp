<template>
    <view class="preEdit">
        <view class="swiper-component">
            <swiper class="swiper-content" :indicator-dots="true" :autoplay="autoplay" :interval="interval" :duration="duration">
                <block v-for="(item, index) in swiperDatas" :key="index">
                    <swiper-item>
                        <image :src="item.imgurl" class="slide-image" />
                    </swiper-item>
                </block>
            </swiper>
        </view>

        <view class="preEdit-content">
            <view class="title">{{ detail.name }}</view>
            <view class="block">
                <view>冲印尺寸</view>
                <view>{{ detail.widthMm }}*{{ detail.heightMm }}</view>
            </view>
            <view class="block">
                <view>像素尺寸</view>
                <view>{{ detail.widthPx }}*{{ detail.heightPx }}</view>
            </view>
            <view class="block">
                <view>颜色可选</view>

                <view class="dec colorPick">
                    <view class="circle" style="background: #fff; border: 1px solid #ddd"></view>
                    <view class="circle" style="background: #438edb"></view>
                    <view class="circle" style="background: #00bff3"></view>
                    <view class="circle" style="background: #ff0000"></view>
                    <view class="circle rainbow"></view>
                    <!-- 五颜六色的按钮 -->
                </view>
            </view>
        </view>

        <view class="bottom">
            <view @tap="chooseImage">相册选择</view>
            <view @tap="chooseCamera">相机拍照</view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            //轮播图配置
            autoplay: true,

            interval: 3000,
            duration: 1200,

            detail: {
                name: '',
                widthMm: '',
                heightMm: '',
                widthPx: '',
                heightPx: ''
            },

            detailtow: {},
            swiperDatas: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        const sizeDetail = JSON.parse(decodeURIComponent(options.data));
        this.detail = sizeDetail
        const data = {
            swiperDatas: [
                {
                    id: 1,
                    imgurl: '/static/pages/preEdit/needs/1.jpg'
                },
                {
                    id: 2,
                    imgurl: '/static/pages/preEdit/needs/2.jpg'
                },
                {
                    id: 3,
                    imgurl: '/static/pages/preEdit/needs/3.jpg'
                }
            ]
        };
        this.swiperDatas = data.swiperDatas
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
        // 相册选择
        chooseImage() {
			let that = this
            if (uni.getStorageSync('token') == '') {
                uni.navigateTo({
                    url: '/pages/login/index'
                });
                return;
            }
			// #ifdef H5
			uni.chooseImage({
				count: 1, // 默认9, 设置图片的选择数量
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
				success: (res) => {
				  // 返回选定照片的本地文件路径列表 tempFilePaths
				  console.log(res);
				  let file = res.tempFiles[0]
				  const fileType = file.name.split('.').pop().toLowerCase();
				  const fileSizeMB = file.size / 1048576;
				  that.handleImage(file.path, fileSizeMB, fileType)
				},
				fail: (err) => {
				  // 处理错误情况
				  console.error(err);
				}
			});
			// #endif
			
			// #ifdef MP-WEIXIN
            uni.chooseMedia({
                count: 1,
                mediaType: 'image',
                sourceType: ['album'],
                sizeType: 'original',
                camera: 'back',
                success: (res) => {
					const file = res.tempFiles[0];
					const fileType = res.tempFiles[0].tempFilePath.split('.').pop().toLowerCase();
					const fileSizeMB = size / 1048576;
                    that.handleImage(file.tempFilePath, fileSizeMB, fileType)
                }
            });
			// #endif
        },
		handleImage(path, fileSizeMB, fileType){
			// 检查文件格式
			if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
			    uni.showToast({
			        title: '不支持该图片格式',
			        icon: 'none',
			        duration: 2000
			    });
			    return;
			}
			
			// 检查文件大小
			if (fileSizeMB > 15) {
			    uni.showToast({
			        title: '图片太大啦，不能超15M哦',
			        icon: 'none',
			        duration: 2000
			    });
			    return;
			}
			this.imgUpload(path);
		},
        // 相机拍照
        chooseCamera() {
            if (uni.getStorageSync('token') == '') {
                uni.navigateTo({
                    url: '/pages/login/index'
                });
                return;
            }
			// #ifdef H5
			uni.chooseImage({
				count: 1, // 默认9，设置图片的数量
				sourceType: ['camera'], // 可选择的源类型，'album'是从相册选图片，'camera'是使用相机拍照
				success: (res) => {
				  // 成功选择图片后的回调
				  console.log(res.tempFilePaths);
				},
				fail: (err) => {
				  // 选择失败的回调
				  console.error(err);
				}
			});
			// #endif
			
			// #ifdef MP-WEIXIN
            const { category, heightMm, heightPx, id, name, widthMm, widthPx } = this.detail;
            //选择相机拍照
            uni.getSetting({
                success(res) {
                    if (res.authSetting['scope.camera']) {
                        uni.navigateTo({
                            url: '/pages/camera/index',
                            success: function (res) {
                                res.eventChannel.emit('chooseCamera', {
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
                    } else {
                        uni.authorize({
                            scope: 'scope.camera',
                            success() {},
                            fail() {
                                that.openConfirm();
                            }
                        });
                    }
                },
                fail() {}
            });
			// #endif
        },

        // 开启摄像头
        openConfirm() {
            uni.showModal({
                content: '检测到您没打开访问摄像头权限，是否打开？',
                confirmText: '确认',
                cancelText: '取消',
                success: function (res) {
                    console.log(res);
                    if (res.confirm) {
                        uni.openSetting({
                            success: (res) => {}
                        });
                    }
                }
            });
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
                useHighPerformanceMode: true,
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
			let that = this
            uni.showLoading({
                title: '制作中...'
            });
            this.$http.request({
                url: 'api/createIdPhoto',
                data: {
                    image: tu,
                    type: this.detail.category == 4 ? 0 : 1,
                    itemId: this.detail.id
                },
                method: 'POST',
            }).then(res => {
				uni.hideLoading();
				that.goEditPage(res.data.data);
			});
        },

        // 制作页面
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
        }
    }
};
</script>
<style>
.preEdit {
    height: 100vh;
    background-color: #fff;
    position: relative;
}

/* 轮播图样式 */
.swiper-component {
    /* margin-top: 6vh; */
    width: 100%;
    height: 28%;
}

.swiper-content {
    width: 100%;
    height: 100%;
}

.slide-image {
    width: 100%;
    height: 100%;
}

/* 照片尺寸 */
.title {
    margin: 30px 20px;
    font-size: 20px;
    font-weight: 500;
}

.block {
    margin: 40px 20px;
    display: flex;
    justify-content: space-between;
}

.dec {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.colorPick {
    display: flex;
}

.circle {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    border-radius: 50%;
}

.rainbow {
    background: linear-gradient(135deg, #ff7f7f, #ffbf80, #ffff80, #80ff80, #80bfff, #bf80ff);
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

.bottom view:first-child {
    width: 40%;
    height: 55px;
    margin-left: 30px;
    background-color: #eee;
    border-radius: 10px;
    font-size: 18px;
    text-align: center;
    line-height: 55px;
}

.bottom view:last-child {
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
