<template>
	<view v-if="dialogVisible" class="page-root">
		<cropper ref="image-cropper" :disableRotate="true" disableCtrl :width="width" :height="height"
			:export_scale="export_scale" :src="src" @load="loadimage" :resetCut="true">
		</cropper>

		<view class="page-buttons">
			<view v-if="src" class="page-button page-button-submit" hover-class="hover-btn" @click="tapComplete">确定
			</view>
			<view class="page-button-cancel" hover-class="hover-btn" @click="tapCancel">取消
			</view>

		</view>
	</view>
</template>

<script>
	/**
	 * @author: lihai
	 * @Description: 裁剪图片的页面
	 */
	import cropper from "./components/uniapp-nice-cropper/cropper.vue";

	// #ifdef H5
	/**
	 * @param {Object} dataurl 将base64转blob对象
	 */
	function dataURLtoBlob(dataurl) {
		// console.log(dataurl)
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n); //8位无符号整数，长度1个字节  
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		// console.log(JSON.stringify(u8arr));  
		return new Blob([u8arr], {
			type: mime
		});
	}

	/**
	 * base64图片转成URL
	 */
	function getBase64URL(pic) {
		const blob = dataURLtoBlob(pic)
		const blobUrl = URL.createObjectURL(blob);
		return blobUrl
	}
	// #endif

	export default {
		components: {
			cropper
		},
		data() {
			return {
				src: null,
				width: 250,
				//宽度
				height: 250,
				export_scale: 1,
				confirmFunc: () => {},
				cancelFunc: () => {},
				dialogVisible: false
			}
		},
		onLoad: function(options) {

		},

		methods: {

			show(options) {
				this.height = Math.round(options.h / options.w * 250);
				this.export_scale = options.w / 250; // 将导出的图像缩放还原成指定的图像尺寸
				this.avatarUrl = options.avatarUrl;
				uni.showLoading({
					title: '加载中'
				}); // 选择图片
				if (this.avatarUrl) {
					this.src = this.avatarUrl;
				} else {
					uni.chooseImage({
						count: 1,
						success: (res) => {
							let tempFilePath = res.tempFilePaths[0];
							this.src = tempFilePath;
						}
					});
				}


				return new Promise((resolve, reject) => {
					this.dialogVisible = true;
					this.confirmFunc = resolve;
					this.cancelFunc = reject;
				});
			},

			loadimage(e) {
				// console.log("图片加载完成", e.detail);
				uni.hideLoading(); //重置图片角度、缩放、位置

			},
			/**
			 * 响应 - 裁剪完成
			 */
			tapComplete: function(e) {
				let self = this;
				// new Promise((resolve, reject) => {
				// 	resolve({
				// 		url: this.resultImgPath
				// 	})
				// })

				this.$refs["image-cropper"].runCrop().then(res => {
					return new Promise((resolve, reject) => {
						uni.getFileInfo({
							filePath: res.url,
							success: (res) => {
								resolve(res)
							},
							fail: (err) => {
								reject(err)
							}
						})
					}).then(fileInfo => {
						console.log('fileInfo', fileInfo);
						// #ifdef H5
						this.confirmFunc({
							tempFilePath: getBase64URL(res.url),
							size: fileInfo.size
						});
						// #endif
						
						// #ifdef MP
						this.confirmFunc({
							tempFilePath: res.url,
							size: fileInfo.size
						});
						// #endif
						
					});
				}).then(() => {
					this.dialogVisible = false;
				});
			},

			tapCancel() {
				this.dialogVisible = false;
				this.cancelFunc();
			}
		}
	}
</script>
<style scoped>
	.page-root {
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
	}

	.page-buttons {
		position: fixed;
		z-index: 1000;
		bottom: 0;
		height: 208rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.page-button {
		width: 400rpx;
		height: 88rpx;
		background-color: white;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		border: 4rpx #0D889A solid;
		border-radius: 110rpx;
		font-size: 36rpx;
		box-sizing: border-box;
	}

	.page-button-disable {
		opacity: 0.5;
	}

	.page-button-submit {
		color: white;
		background-color: #0D889A;
	}

	.page-button-cancel {
		/* background-color: white; */
		margin-top: 18rpx;
		color: white;

	}
</style>