const ABS = Math.abs;
const calcLen = (v) => {
	return Math.sqrt(v.x * v.x + v.y * v.y)
};
const calcAngle = (a, b) => {
	var l = calcLen(a) * calcLen(b);
	var cosValue;
	var angle;
	if (l) {
		cosValue = (a.x * b.x + a.y * b.y) / l;
		angle = Math.acos(Math.min(cosValue, 1));
		angle = a.x * b.y - b.x * a.y > 0 ? -angle : angle;
		return angle * 180 / Math.PI
	}
	return 0
};
const generateCanvasId = () => {
	const seeds = 'abcdefghijklmnopqrstuvwxyz';
	const arr = seeds.split('').concat(seeds.toUpperCase().split('')).concat('0123456789'.split(''));
	let m = arr.length;
	let i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		const temp = arr[m];
		arr[m] = arr[i];
		arr[i] = temp
	}
	return arr.slice(0, 16).join('')
};
export default {
	props: {
		width: {
			type: [String, Number],
			default: '100%'
		},
		height: {
			type: [String, Number],
			default: '100%'
		},
		cutWidth: {
			type: [String, Number],
			default: '50%'
		},
		cutHeight: {
			type: [String, Number],
			default: 0
		},
		minWidth: {
			type: Number,
			default: 50
		},
		minHeight: {
			type: Number,
			default: 50
		},
		center: {
			type: Boolean,
			default: true
		},
		src: String,
		disableScale: Boolean,
		disableRotate: Boolean,
		disableTranslate: Boolean,
		disableCtrl: Boolean,
		boundDetect: Boolean,
		freeBoundDetect: Boolean,
		keepRatio: Boolean,
		disablePreview: Boolean,
		showCtrlBorder: Boolean,
		resetCut: Boolean,
		fit: {
			type: Boolean,
			default: true
		},
		imageCenter: Boolean,
		maxZoom: {
			type: Number,
			default: 10
		},
		minZoom: {
			type: Number,
			default: 1
		},
		angle: {
			type: Number,
			default: 0
		},
		zoom: {
			type: Number,
			default: 1
		},
		offset: {
			type: Array,
			default () {
				return [0, 0]
			}
		},
		background: {
			type: String,
			default: '#000'
		},
		canvasBackground: {
			type: String,
			default: '#fff'
		},
		canvasZoom: {
			type: Number,
			default: 1
		},
		fileType: {
			type: String,
			default: 'png',
			validator(t) {
				return ['png', 'jpg'].includes(t)
			}
		},
		quality: {
			type: Number,
			default: 1
		},
		maskType: {
			type: String,
			default: "shadow"
		},
		circleView: Boolean
	},
	data() {
		return {
			transform: {
				angle: 0,
				translate: {
					x: 0,
					y: 0
				},
				zoom: 1
			},
			corner: {
				left: 50,
				right: 50,
				bottom: 50,
				top: 50
			},
			image: {
				originWidth: 0,
				originHeight: 0,
				width: 0,
				height: 0
			},
			ctrlWidth: 0,
			ctrlHeight: 0,
			view: false,
			canvasId: ''
		}
	},
	computed: {
		transformMeta: function() {
			const transform = this.transform;
			return `translate3d(${transform.translate.x}px,${transform.translate.y}px,0)rotate(${transform.angle}deg)scale(${transform.zoom})`
		},
		ctrlStyle: function() {
			const corner = this.corner;
			let cssStr =
				`left:${corner.left}px;top:${corner.top}px;right:${corner.right}px;bottom:${corner.bottom}px;`;
			if (this.maskType !== 'outline') {
				cssStr += `box-shadow:0 0 0 50000rpx rgba(0,0,0,${this.view?0.8:0.4})`
			} else {
				cssStr += `outline:rgba(0,0,0,${this.view?0.8:0.4})solid 5000px`
			}
			return cssStr
		}
	},
	watch: {
		src: function() {
			if (this.resetCut) this.resetCutReact();
			this.initImage()
		}
	},
	created() {
		this.canvasId = generateCanvasId();
		uni.getSystemInfo().then(result => {
			result = result[1] || {
				windowWidth: 375,
				windowHeight: 736
			};
			this.ratio = result.windowWidth / 750;
			this.windowHeight = result.windowHeight;
			this.init();
			this.initCanvas()
		})
	},
	methods: {
		toPx(str) {
			if (str.indexOf('%') !== -1) {
				return Math.floor(Number(str.replace('%', '')) / 100 * this.containerWidth)
			}
			if (str.indexOf('rpx') !== -1) {
				return Math.floor(Number(str.replace('rpx', '')) * this.ratio)
			}
			return Math.floor(Number(str.replace('px', '')))
		},
		initCanvas() {
			// #ifdef MP-ALIPAY
			const context = uni.createSelectorQuery();
			// #endif
			// #ifndef MP-ALIPAY
			const context = uni.createSelectorQuery().in(this);
			// #endif
			context.select('.nice-cropper').boundingClientRect();
			context.exec(res => {
				this.containerWidth = res[0].width;
				this.containerHeight = res[0].height;
				this.initCut()
			})
		},
		resetCutReact() {
			this.ctrlWidth = Math.min(this.toPx(this.cutWidth), this.containerWidth);
			if (this.cutHeight) {
				this.ctrlHeight = Math.min(this.toPx(this.cutHeight), this.containerHeight)
			} else {
				this.ctrlHeight = Math.min(this.ctrlWidth, this.containerHeight)
			}
			const cornerStartX = this.center ? Math.floor((this.containerWidth - this.ctrlWidth) / 2) : 0;
			const cornerStartY = this.center ? Math.floor((this.containerHeight - this.ctrlHeight) / 2) : 0;
			this.cutRatio = this.ctrlHeight / this.ctrlWidth;
			this.corner = {
				left: cornerStartX,
				right: this.containerWidth - this.ctrlWidth - cornerStartX,
				top: cornerStartY,
				bottom: this.containerHeight - this.ctrlHeight - cornerStartY
			}
		},
		initCut() {
			this.resetCutReact();
			this.initImage()
		},
		async initImage() {
			if (!this.src) return;
			const [err, res] = await uni.getImageInfo({
				src: this.src
			});
			if (err) {
				this.$emit("error", err)
			} else {
				this.$emit('load', res)
			}
			this.image.originWidth = err ? this.ctrlWidth : res.width;
			this.image.originHeight = err ? this.ctrlHeight : res.height;
			this.image.width = this.fit ? this.ctrlWidth : this.image.originWidth;
			this.image.height = err ? this.ctrlHeight : res.height / res.width * this.image.width;
			this.img = res.path;
			const offset = [0, 0];
			if (this.imageCenter) {
				offset[0] = (this.ctrlWidth - this.image.width) / 2;
				offset[1] = (this.ctrlHeight - this.image.height) / 2
			}
			offset[0] += this.offset[0] || 0;
			offset[1] += this.offset[1] || 0;
			this.setTranslate(offset);
			this.setZoom(this.zoom);
			this.transform.angle = this.freeBoundDetect || !this.disableRotate ? this.angle : 0;
			this.setBoundary();
			this.preview();
			
			// h5打开后不操作可能会出现没有画到画布的情况，这里延迟一下就解决了，统一加上延迟吧
			setTimeout(() => {
				this.draw()
			}, 100)
		},
		init() {
			this.pretouch = {};
			this.handles = {};
			this.preVector = {
				x: 0,
				y: 0
			};
			this.distance = 30;
			this.touch = {};
			this.movetouch = {};
			this.cutMode = false;
			this.params = {
				zoom: 1,
				deltaX: 0,
				deltaY: 0,
				diffX: 0,
				diffY: 0,
				angle: 0
			}
		},
		start(e) {
			if (!this.src) e.preventDefault();
			const point = e.touches ? e.touches[0] : e;
			const touch = this.touch;
			const now = Date.now();
			touch.startX = point.pageX;
			touch.startY = point.pageY;
			touch.startTime = now;
			this.doubleTap = false;
			this.view = false;
			clearTimeout(this.previewTimer);
			if (e.touches.length > 1) {
				var point2 = e.touches[1];
				this.preVector = {
					x: point2.pageX - this.touch.startX,
					y: point2.pageY - this.touch.startY
				};
				this.startDistance = calcLen(this.preVector)
			} else {
				let pretouch = this.pretouch;
				this.doubleTap = this.pretouch.time && now - this.pretouch.time < 300 && ABS(touch.startX - pretouch
					.startX) < 30 && ABS(touch.startY - pretouch.startY) < 30 && ABS(touch.startTime - pretouch
					.time) < 300;
				pretouch = {
					startX: this.touch.startX,
					startY: this.touch.startY,
					time: this.touch.startTime
				}
			}
		},
		move(e) {
			if (!this.src) return;
			const point = e.touches ? e.touches[0] : e;
			if (e.touches.length > 1) {
				const point2 = e.touches[1];
				const v = {
					x: point2.pageX - point.pageX,
					y: point2.pageY - point.pageY
				};
				if (this.preVector.x !== null) {
					if (this.startDistance) {
						const len = calcLen(v);
						this.params.zoom = calcLen(v) / this.startDistance;
						this.startDistance = len;
						this.cutMode && !this.disableCtrl ? this.setCut() : !this.disableScale && this.pinch()
					}
					this.params.angle = calcAngle(v, this.preVector);
					this.cutMode && !this.disableCtrl ? this.setCut() : !this.disableRotate && this.rotate()
				}
				this.preVector.x = v.x;
				this.preVector.y = v.y
			} else {
				const diffX = point.pageX - this.touch.startX;
				const diffY = point.pageY - this.touch.startY;
				this.params.diffY = diffY;
				this.params.diffX = diffX;
				if (this.movetouch.x) {
					this.params.deltaX = point.pageX - this.movetouch.x;
					this.params.deltaY = point.pageY - this.movetouch.y
				} else {
					this.params.deltaX = this.params.deltaY = 0
				}
				if (ABS(diffX) > 30 || ABS(diffY) > 30) {
					this.doubleTap = false
				}
				this.cutMode && !this.disableCtrl ? this.setCut() : !this.disableTranslate && this.translate();
				this.movetouch.x = point.pageX;
				this.movetouch.y = point.pageY
			}!this.cutMode && this.setBoundary();
			if (e.touches.length > 1) {
				e.preventDefault()
			}
		},
		end() {
			this.doubleTap && this.$emit('doubleTap');
			this.cutMode && this.setBoundary();
			this.init();
			!this.disablePreview && this.preview();
			this.draw()
		},
		translate() {
			const transform = this.transform.translate;
			const meta = this.params;
			transform.x += meta.deltaX;
			transform.y += meta.deltaY
		},
		pinch() {
			this.transform.zoom *= this.params.zoom
		},
		rotate() {
			this.transform.angle += this.params.angle
		},
		setZoom(scale) {
			scale = Math.min(Math.max(Number(scale) || 1, this.minZoom), this.maxZoom);
			this.transform.zoom = scale
		},
		setTranslate(offset) {
			if (Array.isArray(offset)) {
				const x = Number(offset[0]);
				const y = Number(offset[1]);
				this.transform.translate.x = isNaN(x) ? this.transform.translate.x : this.corner.left + x;
				this.transform.translate.y = isNaN(y) ? this.transform.translate.y : this.corner.top + y
			}
		},
		setRotate(angle) {
			this.transform.angle = Number(angle) || 0
		},
		setTransform(x, y, angle, scale) {
			this.setTranslate([x, y]);
			this.setZoom(scale);
			this.setRotate(angle)
		},
		setCutMode(type) {
			if (!this.src) return;
			this.cutMode = true;
			this.cutDirection = type
		},
		setCut() {
			const corner = this.corner;
			const meta = this.params;
			this.setMeta(this.cutDirection, meta);
			if (this.keepRatio) {
				if (this.cutDirection === 'lt' || this.cutDirection === 'rb') {
					meta.deltaY = meta.deltaX * this.cutRatio
				} else {
					meta.deltaX = meta.deltaY / this.cutRatio
				}
			}
			switch (this.cutDirection) {
				case 'lt':
					corner.top += meta.deltaY;
					corner.left += meta.deltaX;
					break;
				case 'rt':
					corner.top += meta.deltaY;
					corner.right -= this.keepRatio ? -meta.deltaX : meta.deltaX;
					break;
				case 'rb':
					corner.right -= meta.deltaX;
					corner.bottom -= meta.deltaY;
					break;
				case 'lb':
					corner.bottom -= meta.deltaY;
					corner.left += this.keepRatio ? -meta.deltaX : meta.deltaX;
					break
			}
			this.ctrlWidth = this.containerWidth - corner.left - corner.right;
			this.ctrlHeight = this.containerHeight - corner.top - corner.bottom
		},
		setMeta(direction, meta) {
			const {
				ctrlWidth,
				ctrlHeight,
				minWidth,
				minHeight
			} = this;
			switch (direction) {
				case 'lt':
					if (meta.deltaX > 0 || meta.deltaY > 0) {
						meta.deltaX = Math.min(meta.deltaX, ctrlWidth - minWidth);
						meta.deltaY = Math.min(meta.deltaY, ctrlHeight - minHeight)
					}
					break;
				case 'rt':
					if (meta.deltaX < 0 || meta.deltaY > 0) {
						meta.deltaX = Math.max(meta.deltaX, minWidth - ctrlWidth);
						meta.deltaY = Math.min(meta.deltaY, ctrlHeight - minHeight)
					}
					break;
				case 'rb':
					if (meta.deltaX < 0 || meta.deltaY < 0) {
						meta.deltaX = Math.max(meta.deltaX, minWidth - ctrlWidth);
						meta.deltaY = Math.max(meta.deltaY, minHeight - ctrlHeight)
					}
					break;
				case 'lb':
					if (meta.deltaX > 0 || meta.deltaY < 0) {
						meta.deltaX = Math.min(meta.deltaX, ctrlWidth - minWidth);
						meta.deltaY = Math.max(meta.deltaY, minHeight - ctrlHeight)
					}
					break
			}
		},
		setBoundary() {
			let zoom = this.transform.zoom;
			zoom = zoom < this.minZoom ? this.minZoom : (zoom > this.maxZoom ? this.maxZoom : zoom);
			this.transform.zoom = zoom;
			if (!this.boundDetect || !this.disableRotate && !this.freeBoundDetect) return true;
			const translate = this.transform.translate;
			const corner = this.corner;
			const minX = corner.left - this.image.width + this.ctrlWidth - this.image.width * (zoom - 1) / 2;
			const maxX = corner.left + this.image.width * (zoom - 1) / 2;
			const minY = corner.top - this.image.height + this.ctrlHeight - this.image.height * (zoom - 1) / 2;
			const maxY = corner.top + this.image.height * (zoom - 1) / 2;
			translate.x = Math.floor(translate.x < minX ? minX : (translate.x > maxX ? maxX : translate.x));
			translate.y = Math.floor(translate.y < minY ? minY : (translate.y > maxY ? maxY : translate.y))
		},
		preview() {
			clearTimeout(this.previewTimer);
			this.previewTimer = setTimeout(() => {
				this.view = true
			}, 500)
		},
		draw() {
			// #ifdef MP-ALIPAY
			const context = uni.createCanvasContext(this.canvasId);
			// #endif
			// #ifndef MP-ALIPAY
			const context = uni.createCanvasContext(this.canvasId, this);
			// #endif
			const transform = this.transform;
			const corner = this.corner;
			const canvasZoom = this.canvasZoom;
			const img = this.image;
			context.save();
			context.setFillStyle(this.canvasBackground);
			this.$emit('beforeDraw', context, transform);
			const zoom = transform.zoom;
			context.fillRect(0, 0, this.ctrlWidth * canvasZoom, this.ctrlHeight * canvasZoom);
			context.translate((transform.translate.x - corner.left + img.width / 2) * canvasZoom, (transform.translate
				.y - corner.top + img.height / 2) * canvasZoom);
			context.rotate(transform.angle * Math.PI / 180);
			context.translate(-img.width * zoom * 0.5 * canvasZoom, -img.height * zoom * 0.5 * canvasZoom);
			context.drawImage(this.img, 0, 0, img.width * zoom * canvasZoom, img.height * zoom * canvasZoom);
			context.restore();
			this.$emit('afterDraw', context, {
				width: this.ctrlWidth * canvasZoom,
				height: this.ctrlHeight * canvasZoom
			});

			context.draw(false);
		},

		runCrop() {
			return new Promise((resolve, reject) => {
				// #ifdef MP-ALIPAY
				const context = uni.createCanvasContext(this.canvasId);
				// #endif
				// #ifndef MP-ALIPAY
				const context = uni.createCanvasContext(this.canvasId, this);
				// #endif
				uni.canvasToTempFilePath({
					canvasId: this.canvasId,
					quality: this.quality || 1,
					fileType: this.fileType,
					success: (res) => {
						// this.$emit('cropped', res.tempFilePath, {
						// 	originWidth: this.image.originWidth,
						// 	originHeight: this.image.originHeight,
						// 	width: this.ctrlWidth * canvasZoom,
						// 	height: this.ctrlHeight * canvasZoom,
						// 	scale: zoom,
						// 	translate: {
						// 		x: transform.translate.x,
						// 		y: transform.translate.y
						// 	},
						// 	rotate: transform.angle
						// })
						resolve({
							url: res.tempFilePath
						})
					},
					fail: err => {
						console.error(err)
					}
				}, this)
			})

		}
	}
};