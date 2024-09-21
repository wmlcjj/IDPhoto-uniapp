<template>
	<div>
		<uni-popup ref="popup" type="bottom" @change="onPopupChange">
			<div class="popup-root">
				<form @submit="onSubmit">
					<div class="header">{{title}}</div>
					<div v-if="options.desc" class="desc">{{options.desc}}</div>
					<div class="content">
						<!-- #ifdef MP-ALIPAY -->
						<template v-if="formData.avatarUrl==null">
							<button class="btn" type="primary" open-type="getAuthorize" scope="userInfo"
								@getUserInfo="onGetUserInfo">
								授权获取头像和昵称
							</button>
						</template>
						<template v-else>
							<div v-if="!options.avatarUrl.disable" class="section-line">
								<div class="section-line-title">头像</div>
								<div class="avatar-wrapper flex-cnsc">
									<image mode="aspectFit" class="avatar" :src="formData.avatarUrl">
									</image>
								</div>

							</div>
							<div v-if="!options.nickName.disable" class="section-line">
								<div class="section-line-title">昵称</div>
								<!-- <input class="section-line-inputText" type="nickname" name="nickName" placeholder="请输入昵称"
								v-model="formData.nickName" maxlength="16" /> -->
								<div class="section-line-inputText">{{formData.nickName}}</div>
							</div>
						</template>
						<!-- #endif -->


						<!-- #ifdef MP-WEIXIN  -->
						<div v-if="!options.avatarUrl.disable" class="section-line">
							<div class="section-line-title">头像</div>
							<button class="avatar-wrapper flex-cnsc" @chooseavatar="tapAvatar" open-type="chooseAvatar">
								<image mode="aspectFit" class="avatar" :src="formData.avatarUrl"></image>
							</button>
						</div>
						<div v-if="!options.nickName.disable" class="section-line">
							<div class="section-line-title">昵称</div>
							<input class="section-line-inputText" type="nickname" name="nickName" placeholder="请输入昵称"
								v-model="formData.nickName" maxlength="16" />
						</div>
						<!-- #endif -->

						<!-- #ifndef MP-WEIXIN || MP-ALIPAY-->

						<div v-if="!options.avatarUrl.disable" class="section-line">
							<div class="section-line-title">头像</div>
							<button class="avatar-wrapper flex-cnsc" @click="tapChooseImage">
								<image mode="aspectFit" class="avatar" :src="formData.avatarUrl"></image>
							</button>
						</div>
						<div v-if="!options.nickName.disable" class="section-line">
							<div class="section-line-title">昵称</div>
							<input class="section-line-inputText" type="nickname" name="nickName" placeholder="请输入昵称"
								v-model="formData.nickName" maxlength="16" />
						</div>
						<!-- #endif -->

					</div>

					<div class="footer">
						<button type="default" class="btn btn-cancel" @click="tapCancel">取消</button>
						<button type="primary" formType="submit" class="btn flex-cncc">确认</button>
					</div>
				</form>
				<div :style="{height:paddingBottom}"></div>
			</div>
		</uni-popup>
		<ImageCropper ref="imageCropper"></ImageCropper>
	</div>

</template>

<script>
	import ImageCropper from "./ImageCropper/ImageCropper.vue";
	import UniPopup from "./uni-popup/uni-popup.vue";
	import * as upload from "./upload.js";

	function isObject(target) {
		return Object.prototype.toString.call(target) === "[object Object]";
	}

	function isArray(target) {
		return Object.prototype.toString.call(target) === "[object Array]";
	}

	function deepMerge(target, other) {
		if (isObject(target) && isObject(other)) {
			for (let [key, val] of Object.entries(other)) {
				if (isObject(val) || isArray(val)) {
					target[key] = deepMerge(target[key], val);
				} else {
					target[key] = val;
				}
			}
		} else if (isArray(target) && isArray(other)) {
			for (let [key, val] of Object.entries(other)) {
				if (isObject(val) || isArray(val)) {
					target[key] = deepMerge(target[key], val);
				} else {
					target.push(val);
				}
			}
		}
		return target;
	}
	/**
	 * 判断字符串是否为空
	 */
	function isEmptyStr(str) {
		return str == null || str.trim().length == 0;
	}

	export default {
		name: "UserProfileDialog",
		props: {
			paddingBottom: {
				type: String,
				default: "0rpx"
			},

			// 头像的尺寸，微信会获取头像时会先调出裁剪框进行裁剪返回已经是宽度为132的图片，为了兼容其他平台或者微信没有裁剪的情况，如果获取到的图片超过132才再进行裁剪，
			imgWidth: {
				type: Number,
				default: 132
			}
		},
		components: {
			ImageCropper,
			UniPopup
		},
		data() {
			return {
				title: "请输入头像和昵称",
				confirmFunc: () => {},
				cancelFunc: () => {},
				cancel: false,
				formData: {
					avatarUrl: null,
					nickName: null
				},
				options: {
					desc: null, //描述
					nickName: {
						requried: true, // 是否必填
						disable: false // 是否隐藏
					},
					avatarUrl: {
						requried: true, // 是否必填
						disable: false // 是否隐藏
					}
				},
				isCanEdit: true
			};
		},

		methods: {
			show(options) {
				if (options) {
					deepMerge(this.options, options);
					// console.log("合并结果", this.options, options)
				}
				let titleEle = [];
				if (!this.options.avatarUrl.disable) {
					titleEle.push("头像")
				}
				if (!this.options.nickName.disable) {
					titleEle.push("昵称")
				}
				this.title = "请输入" + titleEle.join("和");
				this.tips = {
					avatar: "请授上传头像",
					nickName: "请授输入昵称"
				}
				this.cancel = false;

				// #ifdef MP-ALIPAY
				// 支付宝小程序，尝试获取用户信息
				this.isCanEdit = false;
				this.title = this.title.replace("输入", "授权获取")
				uni.getOpenUserInfo({
					success: (res) => {
						let userInfo = JSON.parse(res.response).response
						this.formData.avatarUrl = userInfo.avatar;
						this.formData.nickName = userInfo.nickName;
					},
					fail: (err) => {
						console.log(err)
					}
				});
				this.tips = {
					avatar: "请授权获取头像",
					nickName: "请授权获取昵称"
				}
				// #endif

				return new Promise((resolve, reject) => {
					this.$refs["popup"].open();
					this.confirmFunc = resolve;
					this.cancelFunc = reject;
				});
			},


			tapAvatar(e) {
				// console.log("结果！！", e)
				new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: e.detail.avatarUrl,
						success: (res) => {
							// console.log("图片尺寸", res)
							resolve(res)
						},
						fail: (err) => {
							// console.error("获取图片信息失败了", err)
							reject(err)
						}
					})
				}).then((res) => {
					if (res.width > this.imgWidth || res.height > this.imgWidth) {
						return this.$refs["imageCropper"].show({
							w: this.imgWidth,
							h: this.imgWidth,
							avatarUrl: e.detail.avatarUrl
						})
					} else {
						return Promise.resolve({
							tempFilePath: e.detail.avatarUrl
						})
					}
				}).then(res => {
					console.log(res);
					return upload.uploadFile(res).then((res) => {
						this.formData.avatarUrl = res.url;
					});
				})
			},

			tapChooseImage() {
				uni.chooseImage({
					count: 1,
				}).then(res => {
					console.log(res);
					let tempFilePath = null;
					// #ifdef H5 || APP
					tempFilePath = res[res.length - 1].tempFilePaths[0];
					// #endif

					// #ifdef MP 
					tempFilePath = res.tempFilePaths[0];
					// #endif

					this.tapAvatar({
						detail: {
							avatarUrl: tempFilePath
						}
					})
				});
			},

			onGetUserInfo(e) {
				this.formData.avatarUrl = e.detail.userInfo.avatar;
				this.formData.nickName = e.detail.userInfo.nickName;
			},

			onSubmit(e) {
				// console.log("!!!", this.formData)
				if (e.detail.value.nickName) {
					this.formData.nickName = e.detail.value.nickName;
				}

				if (!this.formData.avatarUrl && !this.options.avatarUrl.disable && this.options.avatarUrl.requried) {
					uni.showToast({
						icon: "none",
						title: this.tips.avatar
					})
					return;
				}
				// console.log(Util.isEmptyStr(this.formData.nickName), !this.options.nickName.disable, this.options.nickName
				// 	.requried)
				if (isEmptyStr(this.formData.nickName) && !this.options.nickName.disable && this.options.nickName
					.requried) {
					uni.showToast({
						icon: "none",
						title: this.tips.nickName
					})
					return;
				}
				let resultData = Object.assign({}, this.formData);

				this.confirmFunc(resultData);
				this.$refs["popup"].close();
			},

			close() {
				this.$refs["popup"].close();
			},
			tapCancel() {
				this.cancel = true;
				this.$refs["popup"].close();
			},
			onPopupChange(e) {
				if (!e.show) {
					this.cancelFunc(this.cancel ? "cancel" : "close");
				}
			},


		},
	};
</script>

<style lang="scss" scoped>
	.popup-root {
		background-color: white;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.header {
		width: 100%;
		box-sizing: border-box;
		padding: 32rpx;
		text-align: center;
		font-weight: bold;
	}

	.desc {
		width: 100%;
		box-sizing: border-box;
		text-align: center;
		color: #666;
		font-size: 22rpx;
	}

	.content {
		width: 100%;
		padding: 16rpx;
		box-sizing: border-box;
		margin: 20rpx 0;
	}

	.footer {
		width: 100%;
		display: flex;
		justify-content: center;
		box-sizing: border-box;


		.btn {
			width: 200rpx;
			height: 70rpx;
			font-size: 32rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			line-height: unset;
			border-radius: 2rpx;
			border: none;
			margin: unset;

			&::after {
				border: none;
			}
		}

		.btn-cancel {
			// background-color: #f8f8f8;
			margin-right: 40rpx;
		}

	}


	.section-line {
		position: relative;
		display: flex;
		width: 100%;
		padding: 0;
		align-items: center;
		background-color: white;
	}


	.section-line-title {
		font-size: 32rpx;
		color: #818181;
		width: 120rpx;
		text-align: right;
		margin-right: 60rpx;
		flex-shrink: 0;
	}

	.section-line-inputText {
		font-size: 32rpx;
		height: 118rpx;
		text-align: left;
		line-height: 118rpx;
	}

	.section-line:nth-child(n+2)::after {
		content: " ";
		position: absolute;
		top: 0;
		right: 0;
		width: 714rpx;
		height: 2rpx !important;
		background-color: #f5f5f5;
	}

	.avatar-wrapper {
		box-sizing: border-box;
		height: 110rpx;
		width: 100%;

		& {
			padding: unset;
			background-color: transparent;
			border-radius: 0;
			border: none;
			box-sizing: unset;
			margin: unset;
			line-height: normal;
		}

		&::after {
			border: none;
			border-style: none;
			border-width: 0;
			border-radius: 0;
		}

	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		margin-left: 10rpx;
		box-sizing: border-box;
		border: 2rpx #ccc dashed;
	}

	.flex-cnsc {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.flex-cncc {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>