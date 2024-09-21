#  获取昵称、头像的弹窗，适用最新微信小程序
> uniapp 获取昵称、头像弹窗，适用最新微信小程序，官方回收getUserProfile接口后，使用button的开放能力chooseAvatar替换获取头像和昵称。  
> 当选择的图片宽高其中一个超过132px时，将用自带图片裁剪功能进行裁剪

## 平台兼容

| H5	| 微信小程序| 支付宝小程序	| 百度小程序| 头条小程序| QQ 小程序	| App	|
| ---	| ----------| ------------	| ----------| ----------| ---------	| ---	|
| √	| √		| √			| 未测		| 未测		| 未测		| 未测	|


## 代码演示

### 基本用法
```html
<view>
	<cui-userprofiledialog ref="userProfileDialog" paddingBottom="92rpx"></cui-userprofiledialog>
</view>
```

```js
// 页面内调用：
export default {
	methods: {
		tapGetUserProfile() {
			// 使用promise语法
			this.$refs["userProfileDialog"].show({
				desc: "用于显示个人资料", // 说明
				avatarUrl: {
					requried: true, // 是否必填
					disable: false, // 是否隐藏
				},
				nickName: {
					requried: true, // 是否必填
					disable: false, // 是否隐藏
				}
			}).then(res => {
				console.log("结果！！！", res.avatarUrl, res.nickName)
			}, err => {
				console.log("取消")
			});
		},
	}
}
```

```js
// 上传逻辑单独放在upload.js中，之后更新代码更方便
// 注释掉的代码是把图片上传到腾讯云存储，建议可以换成自己的上传逻辑，返回的图片url就可以直接用了
export function uploadFile(res) {
	// 使用本地链接
	return Promise.resolve({
		url: res.tempFilePath
	})
	
	// // 上传到腾讯云
	// wxapi.showLoading({
	// 	title: '上传中'
	// });
	// let file = {
	// 	subKey: 'avatar/' + res.tempFilePath.substring(res.tempFilePath
	// 		.lastIndexOf('/') + 1),
	// 	path: res.tempFilePath,
	// 	size: res.fileSize
	// };
	// return CosWrap.postObject(file.subKey, file).then(cosRes => {
	// 	wxapi.hideLoading();
	// 	console.log('上传成功', cosRes); // 上传成功
	// 	return Promise.resolve({
	// 		url: cosRes.Location
	// 	})
	// }, err => {
	// 	Util.showError(err, "上传");
	// 	wxapi.hideLoading();
	// });
}

```


### 插件标签
- 默认 UserProfileDialog 为 component
- ImageCropper 为图片裁剪组件,当选择的图片宽高其中一个超过132px时，才会调用自带图片裁剪功能进行裁剪
## API
### Props

| 参数			| 说明			| 类型				| 默认值		|
| --------------| ------------	| ----------------	| ------------	|
| paddingBottom	| 下边距		| <em>String</em>	| `0rpx`		|
| imgWidth		| 头像最大尺寸	| <em>Number</em>	| 132			|

### 常见问题
- 依赖 uni-popup，为了方便使用打包进组件包里了，如果项目已经依赖了uni-popup，可以删掉以节约空间

### 示例小程序
![](https://web.wodlong.com/common/qrcode-xbrys.jpg)
![](https://web.wodlong.com/common/qrcode-cui-zfb.jpg)
![](https://web.wodlong.com/common/qrcode-h5.png)
