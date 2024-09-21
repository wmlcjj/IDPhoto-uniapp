

export function uploadFile(res) {
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

	// 使用本地链接
	return Promise.resolve({
		url: res.tempFilePath
	})
}