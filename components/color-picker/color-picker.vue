<template>
    <view :class="'dialog ' + (showClone ? 'dialog_show' : '')">
        <view v-if="mask" class="weui-mask" @tap.stop.prevent="close" @touchmove.stop.prevent="close"></view>
        <view :class="'weui-actionsheet ' + (showClone ? 'weui-actionsheet_toggle' : '')" @touchmove.stop.prevent="preventdefault">
            <view class="weui-half-screen-dialog__hd">
                <view class="weui-half-screen-dialog__hd__side" @tap="close">
                    <a class="weui-icon-btn">
                        <i class="weui-icon-close-thin"></i>
                    </a>
                </view>
                <view class="weui-half-screen-dialog__hd__main">
                    <strong class="weui-half-screen-dialog__title">请选择颜色</strong>
                    <view class="weui-half-screen-dialog__subtitle">点击喜欢的颜色，然后松手即可</view>
                </view>
            </view>
            <movable-area class="target" :style="'background-color:' + hueColor">
                <movable-view direction="all" @change="changeSV" :x="x" :y="y" :animation="false" class="iconfont icon-ios-locate-outline" @touchend="onEnd"></movable-view>
            </movable-area>
            <slider
                @changing="changeHue"
                activeColor="transparent"
                backgroundColor="transparent"
                class="ribbon"
                max="360"
                :value="hsv.h"
                :block-color="colorRes"
                @touchend="onEnd"
            />
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            hsv: {
                h: '',
                s: '',
                v: ''
            },

            x: '',
            y: '',
            hueColor: '',
            colorRes: '',
            showClone: false
        };
    },
    props: {
        initColor: {
            type: String,
            default: 'rgb(255,0,0)'
        },
        maskClosable: {
            type: Boolean,
            default: true
        },
        mask: {
            type: Boolean,
            default: true
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
        // 处理小程序 ready 生命周期
        this.$nextTick(() => this.ready());
    },
    methods: {
        ready() {
            const $ = uni.createSelectorQuery().in(this);
            const target = $.select('.target');
            target.boundingClientRect();
            $.exec((res) => {
                const rect = res[0];
                if (rect) {
                    this.SV = {
                        W: rect.width - 28,

                        //block-size=28
                        H: rect.height - 28,

                        Step: (rect.width - 28) / 100
                    };
                    let { h, s, v } = this.rgb2hsv(this.initColor);
                    // 初始化定位
					this.hsv.h = h
					this.hsv.s = s
					this.hsv.v = v
					this.x = Math.round(s * this.SV.Step)
					this.y = Math.round((100 - v) * this.SV.Step)
                }
            });
        },

        attached() {
            let { initColor } = this;
            this.hueColor = this.hsv2rgb(this.rgb2hsv(initColor).h, 100, 100)
        },

        onEnd() {
            this.$emit('changeColor', {
                detail: {
                    color: this.colorRes
                }
            });
        },

        changeHue: function (e) {
            let hue = e.detail.value;
            this.hsv.h = hue
            this.hueColor = this.hsv2rgb(hue, 100, 100)
            this.colorRes = this.hsv2rgb(hue, this.hsv.s, this.hsv.v)
        },

        changeSV: function (e) {
            let { x, y } = e.detail;
            x = Math.round(x / this.SV.Step);
            y = 100 - Math.round(y / this.SV.Step);
            this.hsv.s = x
            this.hsv.v = y
            this.colorRes = this.hsv2rgb(this.hsv.h, x, y)
        },

        close: function close(e) {
            if (this.maskClosable) {
                this.showClone = false
                this.$emit('close');
            }
        },

        preventdefault: function () {},

        hsv2rgb: function (h, s, v) {
            let hsv_h = (h / 360).toFixed(2);
            let hsv_s = (s / 100).toFixed(2);
            let hsv_v = (v / 100).toFixed(2);
            var i = Math.floor(hsv_h * 6);
            var f = hsv_h * 6 - i;
            var p = hsv_v * (1 - hsv_s);
            var q = hsv_v * (1 - f * hsv_s);
            var t = hsv_v * (1 - (1 - f) * hsv_s);
            var rgb_r = 0;
            var rgb_g = 0;
            var rgb_b = 0;
            switch (i % 6) {
                case 0:
                    rgb_r = hsv_v;
                    rgb_g = t;
                    rgb_b = p;
                    break;
                case 1:
                    rgb_r = q;
                    rgb_g = hsv_v;
                    rgb_b = p;
                    break;
                case 2:
                    rgb_r = p;
                    rgb_g = hsv_v;
                    rgb_b = t;
                    break;
                case 3:
                    rgb_r = p;
                    rgb_g = q;
                    rgb_b = hsv_v;
                    break;
                case 4:
                    rgb_r = t;
                    rgb_g = p;
                    rgb_b = hsv_v;
                    break;
                case 5:
                    rgb_r = hsv_v;
                    rgb_g = p;
                    rgb_b = q;
                    break;
            }
            return 'rgb(' + (Math.floor(rgb_r * 255) + ',' + Math.floor(rgb_g * 255) + ',' + Math.floor(rgb_b * 255)) + ')';
        },

        rgb2hsv: function (color) {
            let rgb = color.split(',');
            let R = parseInt(rgb[0].split('(')[1]);
            let G = parseInt(rgb[1]);
            let B = parseInt(rgb[2].split(')')[0]);
            let hsv_red = R / 255;
            let hsv_green = G / 255;
            let hsv_blue = B / 255;
            let hsv_max = Math.max(hsv_red, hsv_green, hsv_blue);
            let hsv_min = Math.min(hsv_red, hsv_green, hsv_blue);
            let hsv_h;
            let hsv_s;
            let hsv_v = hsv_max;
            let hsv_d = hsv_max - hsv_min;
            hsv_s = hsv_max == 0 ? 0 : hsv_d / hsv_max;
            if (hsv_max == hsv_min) {
                hsv_h = 0;
            } else {
                switch (hsv_max) {
                    case hsv_red:
                        hsv_h = (hsv_green - hsv_blue) / hsv_d + (hsv_green < hsv_blue ? 6 : 0);
                        break;
                    case hsv_green:
                        hsv_h = (hsv_blue - hsv_red) / hsv_d + 2;
                        break;
                    case hsv_blue:
                        hsv_h = (hsv_red - hsv_green) / hsv_d + 4;
                        break;
                }
                hsv_h /= 6;
            }
            return {
                h: (hsv_h * 360).toFixed(),
                s: (hsv_s * 100).toFixed(),
                v: (hsv_v * 100).toFixed()
            };
        }
    },
    created: function () {},
    watch: {
        show: {
            handler: function (newVal, oldVal) {
                this.showClone = newVal;
            },

            immediate: true
        }
    }
};
</script>
<style>
.dialog {
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s;
}

.dialog_show {
    visibility: visible;
    opacity: 1;
}

.target {
    height: 600rpx;
    width: 600rpx;
    margin: 0 auto;
    background-image: url('https://cdn.jsdelivr.net/gh/makergyt/mini-color-picker@v0.1.2/screenshot/color_picker_mask.png');
    overflow: hidden;
    border: 0.5px solid rgba(0, 0, 0, 0.5);
}

.ribbon {
    background: -webkit-linear-gradient(left, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    width: 600rpx;
    margin: 40rpx auto;
}

@font-face {
    font-family: 'iconfont';
    src: url(data:font/truetype;charset=utf-8;base64,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)
        format('truetype');
    font-weight: normal;
    font-style: normal;
}

.iconfont {
    font-family: 'iconfont' !important;
    font-size: 28px;
    line-height: 28px;
    height: 28px;
    width: 28px;
    color: white;
    text-align: center;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon-ios-locate-outline:before {
    content: '\ea49';
}

.weui-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
}

.weui-actionsheet {
    position: fixed;
    left: 0;
    bottom: 0;
    transform: translate(0, 100%);
    backface-visibility: hidden;
    z-index: 5000;
    width: 100%;
    background-color: #fff;
    transition: transform 0.3s;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    overflow: hidden;
    padding-bottom: calc(env(safe-area-inset-bottom));
}

.weui-actionsheet_toggle {
    transform: translate(0, 0);
}

.weui-half-screen-dialog__hd {
    padding: 0 calc(24px + env(safe-area-inset-right));
    font-size: 8px;
    height: 8em;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.weui-half-screen-dialog__hd .weui-icon-btn {
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}

.weui-half-screen-dialog__hd__side {
    position: relative;
    left: -8px;
}

.weui-half-screen-dialog__hd__main {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.weui-half-screen-dialog__hd__side + .weui-half-screen-dialog__hd__main {
    text-align: center;
    padding: 0 40px;
}

.weui-half-screen-dialog__hd__main + .weui-half-screen-dialog__hd__side {
    right: -8px;
    left: auto;
}

.weui-half-screen-dialog__hd__main + .weui-half-screen-dialog__hd__side .weui-icon-btn {
    right: 0;
}

.weui-half-screen-dialog__title {
    display: block;
    color: rgba(0, 0, 0, 0.9);
    font-weight: 700;
    font-size: 15px;
}

.weui-half-screen-dialog__subtitle {
    display: block;
    color: rgba(0, 0, 0, 0.5);
    font-size: 10px;
}

.weui-icon-close-thin {
    -webkit-mask-image: url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.25%2010.693L6.057%204.5%205%205.557l6.193%206.193L5%2017.943%206.057%2019l6.193-6.193L18.443%2019l1.057-1.057-6.193-6.193L19.5%205.557%2018.443%204.5z%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E);
    mask-image: url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.25%2010.693L6.057%204.5%205%205.557l6.193%206.193L5%2017.943%206.057%2019l6.193-6.193L18.443%2019l1.057-1.057-6.193-6.193L19.5%205.557%2018.443%204.5z%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E);
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    -webkit-mask-position: 50% 50%;
    mask-position: 50% 50%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100%;
    mask-size: 100%;
    background-color: currentColor;
}
</style>
