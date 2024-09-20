<template>
    <view class="works">
        <view class="container" :data-index="id" v-for="(item, id) in workList" :key="id">
            <view class="left">
                <view class="photo">
                    <image style="width: 100%; height: 100%" :src="getImagePreviewUrl(item.nimg)"></image>
                </view>
                <view class="msg">
                    <view>{{ item.name }}</view>
                    <view>{{ item.size }} px</view>
                    <view>{{ item.createTime }}</view>
                </view>
            </view>

            <view class="right" style="display: flex; flex-direction: column; align-items: stretch; margin-top: 20px">

                <!-- 保存按钮 -->
                <button type="primary" @tap.native="downloadAndSaveImg(item.nimg)" style="margin-bottom: 20px">保存</button>

                <!-- 删除按钮 -->
                <button type="warn" @tap.native="remove(item.id )">删除</button>
            </view>
        </view>
        <view class="none" v-if="!workList.length">
            <image src="/static/pages/searchs/images/none.png" style="width: 100%; height: 100%"></image>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            workList: [],
            pageNum: 1,
            pageSize: 5,
            hasMore: true,
            id: ''
        };
    }, // 页面加载时请求第一页数据
    onLoad() {
        if (!uni.getStorageSync("token")) {
            uni.navigateTo({
                url: '/pages/login/index'
            });
            return;
        }
        this.getSizeList();
    },
    // 页面上拉触底事件（下滑加载下一页）
    onReachBottom() {
        if (this.hasMore) {
            this.setData({
                pageNum: this.pageNum + 1
            });
            this.getSizeList(); // 加载下一页数据
        }
    },
	onBackPress(options) {  
	  this.getSizeList()
    },
    methods: {
		getImagePreviewUrl(id){
			return this.$apiConfig.baseUrl + "/file/preview?id=" + id + "&token=" + uni.getStorageSync("token")
		},
        // 获取数据
        getSizeList() {
            const that = this;

            uni.showLoading({
                title: '加载中...'
            });
            this.$http.request({
                url: 'item/photoList',
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },
                method: 'GET',
            }).then(res => {
				uni.hideLoading();
				if (res.data.code === 200) {
				    const newData = res.data.data;
				    that.workList = that.pageNum === 1 ? newData : that.workList.concat(newData)
					// 拼接新数据
				    that.hasMore = newData.length === that.pageSize // 如果返回的数据少于 pageSize，表示没有更多数据了
				} else if (res.data.code === 500) {
				    that.hasMore = false // 状态码500时，设置为没有更多数据
				    uni.showToast({
				        title: '没有更多数据',
				        icon: 'none',
				        duration: 2000
				    });
				}
			});
        },

        // 删除操作
        remove(id) {
            let that = this;
			uni.showModal({
			    content: '确定要删除这张吗',
			    confirmText: '确认',
			    cancelText: '取消',
			    success: function (res) {
			        if (res.confirm) {
						that.$http.request({
							url: 'item/deletePhotoId',
							data: {
								id: id
							},
							method: 'GET',
						}).then(res => {
							uni.hideLoading();
							if (res.data.code === 200) {
								that.getSizeList(); // 刷新列表
							}
						})
			        }
			    }
			});
        },
		
		// 根据图片id下载保存
		downloadAndSaveImg(picId) {
		    const that = this;
		    this.$http.download('file/download?id=' + picId)
			.then(res => {
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
				        that.checkq(picId); //解决用户拒绝相册
				    }
				});
			}).catch(err => {
				console.log(err);
				uni.showToast({
				    title: '下载图片失败，请重试',
				    icon: 'none',
				    duration: 2000
				});
			});
		},
		
		// 解决用户拒绝相册问题
		checkq(picId) {
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
		                                    this.downloadAndSaveImg(picId);
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
    }
};
</script>
<style>
.works {
    margin-top: 2vh;
}

.container {
    height: 140px;
    border-radius: 13px;
    background-color: #fff;
    margin: 0 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
    margin-bottom: 20px;
}

.left {
    width: 80%;
    height: 100%;
    display: flex;
}

.photo {
    width: 40%;
    height: 100%;
}

.right {
    width: 30%;
    height: 100%;
    font-size: 16px;
    color: rgb(192, 190, 190);
}

.msg {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.msg view:first-child {
    margin-left: 10px;
    font-size: 16px;
    color: #2c2c2c;
    /* margin-bottom: 10px; */
}

.msg view:nth-child(2) {
    margin-left: 10px;
    font-size: 14px;
    color: rgb(192, 190, 190);
    /* margin-bottom: 10px; */
}

.msg view:last-child {
    margin-left: 10px;
    font-size: 14px;
    color: rgb(192, 190, 190);
}

.none {
    width: 300px;
    height: 300px;
    margin: 0 auto;
}
</style>
