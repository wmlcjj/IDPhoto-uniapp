<template>
    <view>
        <view class="top">
			<view >
				<uni-segmented-control :current="current" :values="items" style-type="text"
					active-color="#2c2c2c" @clickItem="clickTab" />
			</view>
			<view class="content">
				<scroll-view class="container" scroll-y @scrolltolower="moredata" :scroll-top="scrollTop">
				    <view :data-index="index" @tap="goNextPage" v-for="(item, index) in photoSizeList" :key="index">
				        <view class="list">
				            <view>
				                <view class="title">{{ item.name }}</view>
				                <view class="description">{{ item.widthPx }}*{{ item.heightPx }} | {{ item.widthMm }}*{{ item.heightMm }}</view>
				            </view>
				            <image style="width: 50px; height: 50px" :src="'/static/pages/sizeList/sizes/' + item.icon + '.png'"></image>
				        </view>
				    </view>
				</scroll-view>
				<view class="scroll-to-top" @tap="scrollToTop">⬆</view>
			</view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
			items: ['常用尺寸', '各类证件', '各类签证', '自定义', '搜索'],
            current: 0,
            category: 1,
            photoSizeList: [],
            pageNum: 1,
            pageSize: 10,
            hasMoreData: true,
            scrollTop: 0
        };
    },
    onLoad: function () {
        this.getSizeList();
    },
    onPullDownRefresh: function () {
        this.photoSizeList=[]
        this.pageNum=1
        this.hasMoreData=true
        this.getSizeList()
    },
    onReachBottom: function () {
        this.moredata();
    },
    methods: {
        clickTab: function (e) {
            this.photoSizeList=[]
            this.category=e.currentIndex + 1
            this.pageNum=1
            this.hasMoreData=true
            if (this.category == 5) {
                uni.navigateTo({
                    url: '/pages/searchs/index'
                });
            } else {
                this.getSizeList();
            }
        },

        getSizeList: function () {
            if (!this.hasMoreData) {
                return;
            }
            uni.showLoading({
                title: '加载中...'
            });
            const that = this;
            this.$http.request({
                url: 'item/itemList',
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    type: this.category
                },
                method: 'GET',
            }).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
				    let newData = res.data.data || [];
				    that.photoSizeList=that.photoSizeList.concat(newData)
				    that.pageNum=that.pageNum + 1
				    that.hasMoreData=newData.length >= that.pageSize
				} else if (res.data.code == 500) {
				    uni.showToast({
				        title: '暂无数据',
				        icon: 'none'
				    });
				}
			}).catch(err => {
				console.log(err);
			});
        },

        moredata: function () {
            this.getSizeList();
        },

        goNextPage: function (e) {
            uni.navigateTo({
                url: '/pages/preEdit/index?index=' + e.currentTarget.dataset.index + '&data=' + JSON.stringify(this.photoSizeList[e.currentTarget.dataset.index])
            });
        },

        scrollToTop: function () {
            this.scrollTop=0
        }
    }
};
</script>
<style>
.top {
    position: fixed;
    left: 0;
    width: 100%;
    height: 8vh;
    background-color: #fff;
    font-size: 16px;
    z-index: 10;
}

.container {
    margin-top: 2vh;
    height: 92vh;
    background-color: #fff;
}

.list {
    display: flex;
    height: 10vh;
    background-color: #2c2c2c;
    margin: 0 20px 20px 20px;
    border-radius: 15px;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.list image {
    margin-right: 20px;
    border-radius: 50%;
}

.list view {
    margin-left: 10px;
}

.title {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: 500;
}

.description {
    font-size: 14px;
}

.none {
    width: 300px;
    height: 300px;
    margin: 0 auto;
}

.scroll-to-top {
    position: fixed;
    bottom: 60px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: #4a95e0;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
