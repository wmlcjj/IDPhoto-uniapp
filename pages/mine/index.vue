<template>
    <view class="my-page">
        <view class="top">
            <!-- 用户头像 未登录 -->
            <view class="user-image" v-if="!authorized">
                <image style="width: 100%; height: 100%" mode="aspectFill" :src="avatarUrl"></image>
            </view>
            <!-- 用户头像 已登录 -->
            <view class="user-image" v-if="authorized" @tap="openEditProfileModal">
                <image style="width: 100%; height: 100%" mode="aspectFill" :src="avatarUrl"></image>
            </view>
            <!-- 未登录 -->
            <view class="user-name" style="width: 6em" @tap="goLogin" v-if="!authorized">
                <view size="mini">登录/注册</view>
            </view>
            <!-- 已登录 -->
            <view class="user-name" style="width: 6em" v-if="authorized" @tap="openEditProfileModal">
                <view class="nickname">
                    Hi，{{ nickname }}
					<uni-icons type="eye" size="16" @tap.native="openEditProfileModal" ></uni-icons>
                </view>
                <view class="user-days" @tap="openEditProfileModal">证件照伴侣已经陪伴你走过 {{ days }} 天</view>
            </view>
        </view>

        <view class="container">
            <view class="button-container">
                <button class="button-item" @tap="mywork">
                    <view class="icon-text">
                        <uni-icons type="images" size="40" ></uni-icons>
                        <text>我的作品</text>
                    </view>
                </button>
                <button class="button-item" @tap="navigateToEdit">
                    <view class="icon-text">
                        <uni-icons type="gift" size="40" ></uni-icons>
                        <text>我的权益</text>
                    </view>
                </button>
                <button class="button-item" @tap="navigateToFree">
                    <view class="icon-text">
                        <uni-icons type="help" size="40" ></uni-icons>
                        <text>常见问题</text>
                    </view>
                </button>
                <button class="button-item" open-type="contact">
                    <view class="icon-text">
                        <uni-icons type="headphones" size="40" ></uni-icons>
                        <text>客服中心</text>
                    </view>
                </button>
<!--                <button class="button-item" @tap="evaluate">
                    <view class="icon-text">
                        <uni-icons type="hand-up" size="40" ></uni-icons>
                        <text>赏好评</text>
                    </view>
                </button> -->
                <button class="button-item" open-type="share">
                    <view class="icon-text">
                        <uni-icons type="redo" size="40" ></uni-icons>
                        <text>分享</text>
                    </view>
                </button>
                <button class="button-item">
                    <view class="icon-text">
                        <uni-icons type="more" size="40" ></uni-icons>
                        <text>待开发</text>
                    </view>
                </button>
            </view>
        </view>

        <!-- 我的权益弹框 -->
        <view class="modal" v-if="modalType === 'rights'">
            <view class="modal-content">
                <view class="modal-body">
                    <view class="modal-title">我的权益</view>
                    <view class="modal-list">
                        <text>● 你目前已经解锁基础功能，并无限制使用;</text>
                        <text>● 你目前享受一对一专属客服，7x24全年极速响应;</text>
                        <text>● 待解锁：排版照，人像抠图，黑白上色，粘土风写真;</text>
                        <text>● 请多多分享小程序，系统将自动为您解锁。</text>
                    </view>
                    <button @tap="closeModal">我明白了</button>
                </view>
            </view>
        </view>

        <!-- 常见问题弹框 -->
        <view class="modal" v-if="modalType === 'questions'">
            <view class="modal-content">
                <view class="modal-body">
                    <view class="modal-title">常见问题</view>
                    <view class="modal-list">
                        <text>● 制作证件照收费吗？ 答：完全免费;</text>
                        <text>● 我的隐私是否安全？ 答：我们不保存您上传的照片，只记录您主动触发下载时的生成图;</text>
                        <text>● 在哪里查看下载记录？ 答：我的作品;</text>
                    </view>
                    <button @tap="closeModal">我明白了</button>
                </view>
            </view>
        </view>

        <!-- 编辑头像和昵称的 -->
        <view class="modal" v-if="modalType === 'editProfile'">
            <view class="modal-content">
                <view class="modal-body">
                    <view class="modal-title">编辑个人资料</view>
                    <view class="edit-profile-form">
                        <!-- 头像选择 -->
                        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
                            <image class="avatar" :src="avatarFile" mode="aspectFill"></image>
                            <view class="overlay">
								<uni-icons type="camera"></uni-icons>
                                <text class="overlay-text">更换头像</text>
                            </view>
                        </button>
                        <!-- 昵称输入 -->
                        <input type="nickname" class="nickname-input" placeholder="请输入昵称(非必填)" :value="nicknameFile" @input="onNicknameInput" />
                    </view>
                    <button class="save-button" @tap="updateUserInfo">保存</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            modalType: null,
            // 用于控制显示哪个模态框
            authorized: false,
            days: 0,
            // 默认头像
            avatarUrl: '',
            // 默认昵称
            nickname: '陌生人',
            // 修改头像
            avatarFile: '',
			//修改昵称
            nicknameFile: ''
        };
    },
    onLoad: function () {},
    // 获取用户信息，同时解决跳转登录后页面还是旧数据问题
    onShow: function () {
        this.getUserInfo()
    },
    // 分享设置
    onShareAppMessage() {
        return {
            title: '哇塞，这个证件照小程序也太好用了吧！好清晰，还免费',
            path: 'pages/home/index',
            imageUrl: '/static/images/share.jpg'
        };
    },
    methods: {
		getUserInfo(){
			let that = this
			this.$http.request({
				url: 'user/getUserInfo',
				method: 'GET',
			}).then(res => {
				that.calculateDays(res.data.data.createTime);
				that.authorized = true
				if (res.data.data.avatar != null) {
					that.avatarUrl = that.handleAvatarUrl(res.data.data.avatar)
					that.avatarFile = that.handleAvatarUrl(res.data.data.avatar)
				}
				if (res.data.data.wxNickName != null) {
					that.nickname = res.data.data.wxNickName,
					that.nicknameFile = res.data.data.wxNickName
				}
			});
		},
		handleAvatarUrl(avatar){
			avatar = avatar && avatar.indexOf('http') >= 0 ? avatar : this.$apiConfig.apiURL + "/file/preview?id="+avatar+"&token="+uni.getStorageSync("token")
			return avatar
		},
        // 修改用户信息
        updateUserInfo: function () {
			let that = this
            const avatarChanged = this.avatarFile != this.avatarUrl;
            const nicknameChanged = this.nicknameFile != this.nickname;

            //如果只修改了头像
            if (avatarChanged) {
				this.$http.upload('user/uploadUserAvatar',{
					filePath: this.avatarFile,
					name: 'file',
				}).then(res => {
					uni.hideLoading();
					let data = res.data.data;
					that.avatarUrl = this.avatarFile
				});
            }

            //如果只修改了昵称
            if (nicknameChanged) {
				let that = this
                if (this.nicknameFile.trim() == '') {
                    uni.hideLoading();
                    this.modalType = null
                    return;
                }
                this.$http.request({
                    url: 'user/updateUserInfo',
                    method: 'POST',
                    data: {
                        nickname: this.nicknameFile
                    },
                    success: (res) => {
                        uni.hideLoading();
						that.nickname = that.nicknameFile
                    }
                });
            }
            uni.hideLoading();
            this.modalType = null
        },

        // 计算天数的函数
        calculateDays: function (time) {
            // 将时间字符串中的 '-' 替换为 '/'，以兼容 IOS 系统
            const formattedStartTimeStr = time.replace(/-/g, '/');
            const startDate = new Date(formattedStartTimeStr);
            const currentDate = new Date();
            const diffTime = currentDate - startDate;
            const diffDays = Math.abs(Math.floor(diffTime / (3600000 * 24)));
            this.days = diffDays
        },

        goLogin: function () {
            uni.navigateTo({
                url: '/pages/login/index'
            });
        },

        // 打开编辑个人资料的模态框
        openEditProfileModal: function () {
            this.modalType = 'editProfile'
        },

        // 获取用户头像临时地址
        onChooseAvatar(e) {
            const { avatarUrl } = e.detail;
            this.avatarFile = avatarUrl
        },

        // 监听昵称输入
        onNicknameInput(e) {
            this.nicknameFile = e.detail.value
        },

        // 关闭模态框
        closeModal: function () {
            this.modalType = null
        },

        // 我的作品
        mywork() {
			uni.navigateTo({
				url: '/pages/works/index'
			});
        },

        // 赏好评
        evaluate() {
            if (uni.openBusinessView) {
                uni.openBusinessView({
                    businessType: 'servicecommentpage',
                    success: (res) => {
                        console.log(res);
                    },
                    fail: (res) => {}
                });
            }
        },

        // 我的权益弹框
        navigateToEdit: function () {
            this.modalType = 'rights'
        },

        // 常见问题弹框
        navigateToFree: function () {
            this.modalType = 'questions'
        }
    }
};
</script>
<style>
/* 页面通用样式 */
.my-page {
    height: 100vh;
    background-color: #f5f5f5; /* 背景颜色 */
}

/* 顶部区域样式 */
.top {
    width: 100%;
    height: 240px;
    display: flex;
    align-items: center;
    background: radial-gradient(circle, #2c2c2c, 60%, #c1cad6);
    clip-path: ellipse(80% 60% at 50% 40%);
    position: relative;
    overflow: hidden;
}

/* 用户头像样式 */
.user-image {
    width: 80px;
    height: 80px;
    background-color: #eee;
    border-radius: 50%;
    margin-left: 20px;
    margin-right: 20px;
    overflow: hidden;
}

.user-image image {
    width: 100%;
    height: 100%;
}

/* 用户名和日期样式 */
.user-name {
    font-size: 17px;
    color: #fff;
    margin-top: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.user-days {
    font-size: 13px;
    color: #fff;
    margin-top: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 编辑图标样式 */
.edit-icon {
    margin-left: 5px;
    color: #fff;
}

.nickname {
    display: flex;
    align-items: center;
    color: #fff;
}

/* 容器样式 */
.container {
    background-color: #fff;
    margin: 0 20px;
    position: relative;
    top: -60px;
    border-radius: 15px;
    padding: 20px 10px;
}

/* 按钮容器样式 */
.button-container {
    text-align: left;
    padding: 0 10px;
}

.button-item::after {
	border: none;
}
/* 按钮项样式 */
.button-item {
    display: inline-block;
    width: calc((100% - 3 * 15px - 2 * 10px) / 4); /* 每行显示4个按钮 */
    margin-right: 15px;
    margin-bottom: 10px;
    vertical-align: top;
    text-align: center;
    background-color: transparent;
    border: none;
    padding: 0;
}

.button-item:nth-child(4n) {
    margin-right: 0;
}

.button-item .icon-text {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button-item .icon-text .van-icon {
    margin: 0;
}

.button-item .icon-text text {
    margin-top: -20px; /* 调整图标和文字之间的间距 */
    font-size: 14px;
    color: #333;
}

/* 模态框样式 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
    background-color: #fff;
    width: 80%;
    border-radius: 10px;
    padding: 20px;
}

.modal-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}

.modal-list text {
    display: block; /* 确保每个文本独占一行 */
    margin-bottom: 10px;
    color: #555;
}

/* 模态框内按钮样式 */
.modal-body button {
    width: 100%;
    background-color: #333;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 10px;
    margin-top: 20px;
    font-size: 16px;
}

/* 编辑个人资料表单样式 */
.edit-profile-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.avatar-wrapper {
    position: relative;
    margin-bottom: 20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
}

.avatar-wrapper .avatar {
    width: 100%;
    height: 100%;
}

.avatar-wrapper .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4); /* 半透明遮罩 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.overlay-text {
    color: #fff;
    font-size: 14px;
    margin-top: 4px;
}

.nickname-input {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 20px;
}

.save-button {
    width: 100%;
    background-color: #07c160;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 5px;
    font-size: 16px;
}

.nickname-input::placeholder {
    color: #999;
}

/* 按钮基础样式 */
button {
    background-color: transparent;
    border: none;
    padding: 0;
}

/* 小屏幕适配 */
@media screen and (max-width: 320px) {
    .button-item {
        width: 30%;
    }
}
</style>
