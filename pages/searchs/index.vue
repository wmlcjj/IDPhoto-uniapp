<template>
    <view class="search">
        <view class="s-input">
			<uni-search-bar @confirm="onChange" v-model="value" 
			placeholder="请输入关键词,如：一寸"
			radius="15"
			cancelButton="false"
			></uni-search-bar>
        </view>
        <scroll-view class="container" scroll-y @scrolltolower="moredata" :scroll-top="scrollTop">
            <view :data-index="id" @tap="goNextPage" v-for="(item, id) in photoSizeList" :key="id">
                <view class="list">
                    <view>
                        <view class="title">{{ item.name }}</view>
                        <view class="description">{{ item.widthPx }}*{{ item.heightPx }} | {{ item.widthMm }}*{{ item.heightMm }}</view>
                    </view>
                    <image style="width: 50px; height: 50px" :src="'/static/pages/sizeList/sizes/' + item.icon + '.png'"></image>
                </view>
            </view>
        </scroll-view>
        <view class="none" v-if="!photoSizeList.length">
            <image src="/static/pages/searchs/images/none.png" style="width: 100%; height: 100%"></image>
        </view>
        <!-- 有问题，没有回到顶部，待修复 -->
        <!-- <view class="scroll-to-top" bindtap="scrollToTop">⬆</view> -->
    </view>
</template>

<script>
import tool from './util';
const app = getApp();
export default {
    data() {
        return {
            value: '',
            photoSizeList: [],
            pageNum: 1,
            pageSize: 10,
            hasMoreData: true,
            scrollTop: 0,
            id: ''
        };
    },
    onLoad: function (options) {},
    onPullDownRefresh: function () {
        this.photoSizeList=[]
        this.pageNum=1
        this.hasMoreData=true
        this.searchData();
        uni.stopPullDownRefresh(); // 停止下拉刷新动作
    },
    onReachBottom: function () {
        this.moredata();
    },
    methods: {
        onChange: function (e) {
            if (e.value) {
                this.value = e.value
                this.pageNum=1
                this.photoSizeList=[]
                this.hasMoreData=true
                this.searchData();
            } else {
                this.value= '',
                this.photoSizeList=[]
                this.hasMoreData=false
            }
        },

        searchData: function () {
            if (!this.hasMoreData) {
                return;
            }
            uni.showLoading({
                title: '搜索中...'
            });
            const that = this;
            uni.request({
                url: app.globalData.url + 'item/itemList',
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    type: 0,
                    name: this.value
                },
                method: 'GET',
                success(res) {
                    uni.hideLoading();
                    if (res.data.code == 200) {
                        let newData = res.data.data || [];
                        that.photoSizeList=that.photoSizeList.concat(newData)
                        that.pageNum = that.pageNum + 1
                        that.hasMoreData=newData.length >= that.pageSize
                    } else {
                        uni.showToast({
                            title: '没有更多尺寸啦~',
                            icon: 'none'
                        });
                    }
                }
            });
        },

        moredata: function () {
            if (this.hasMoreData) {
                this.searchData();
            }
        },

        goNextPage: function (e) {
            uni.navigateTo({
                url: '/pages/preEdit/index?index=' + e.currentTarget.dataset.index + '&data=' + JSON.stringify(this.photoSizeList[e.currentTarget.dataset.index])
            });
        },

        //有问题，没有回到顶部，待修复
        scrollToTop: function () {
            const that = this;
            this.crollTop=1
        }
    }
};
</script>
<style>
.search {
    height: 100vh;
    background-color: #fff;
}

.s-input {
    margin-top: 1vh;
    margin-left: 10px;
    margin-right: 10px;
}

.van-search__content {
    border: 1px solid #2c2c2c;
    background-color: #fff !important;
    color: #2c2c2c !important;
}

.container {
    margin-top: 15px;
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

.none {
    width: 300px;
    height: 300px;
    margin: 0 auto;
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

.scroll-to-top {
    position: fixed;
    bottom: 60px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: #2c2c2c;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
