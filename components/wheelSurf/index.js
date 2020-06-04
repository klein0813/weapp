// components/wheel-surf/index.js
// uploadFile 上传图片到 ALIYUN CDN
import { uploadFile } from '../../utils/util'

let _default = {
  outerCircle: {
    color: '#742f8b'
  },
  innerCircle: {
    color: '#9933CC'
  },
  // dots: ['#FFFEA4', '#D1C4FA'],
  disk: ['#C59FFF', '#D2C5FB', '#9F9FFF'],
  title: {
    color: '#742f8b',
    font: '11' // screenWidth = 375时的字体大小
  },
  angel: 1080,
  startImg: '../images/start_v3.png'
}
let mainIndex = 0
let timer = null
// let isLuckyDrawing = false

Component({
  properties: {
    rewardIndex: {
      type: Number,
      value: 0
    },
    wheelStyle: {
      type: Object,
      value: {}
    },
    awards: {
      type: Array,
      value: [
        {
          "name": "5000元京东卡",
          "image": "https://staging-statics.maiscrm.com/5e43db0972f4370461535362/modules/content/1.png",
          "level": 1
        },
        {
          "name": "1000元京东卡",
          "image": "https://staging-statics.maiscrm.com/5e43db0972f4370461535362/modules/content/2.png",
          "level": 2
        },
        {
          "name": "100个比特币",
          "image": "https://staging-statics.maiscrm.com/5e43db0972f4370461535362/modules/content/3.png",
          "level": 3
        },
        {
          "name": "50元话费",
          "image": "https://staging-statics.maiscrm.com/5e43db0972f4370461535362/modules/content/4.png",
          "level": 4
        },
        {
          "name": "100元话费",
          "image": "https://staging-statics.maiscrm.com/5e43db0972f4370461535362/modules/content/5.png",
          "level": 5
        },
        {
          "name": "500个比特币",
          "image": "https://staging-statics.maiscrm.com/5e43db0972f4370461535362/modules/content/6.png",
          "level": 6
        },
        {
          "name": "500元京东卡",
          "image": "https://staging-statics.maiscrm.com/5e43db0972f4370461535362/modules/content/7.png",
          "level": 7
        },
        {
          "name": "谢谢参与",
          "level": 8
        }
      ]
    },
    canvasSize: {
      type: Number,
      value: 500
    },
    isLuckyDrawing: {
      type: Boolean,
      value: false
    }
  },

  data: {
    angle: 0,
    canvasImg: '',
    wheelStyleShow: _default
  },

  observers: {
    rewardIndex (rewardIndex) {
      if (rewardIndex === -1) {   // 用于请求发出，响应未到时的转动
        timer = setInterval(() => {
          this.setData({
            show: true,
            angle: this.data.angle + this.data.wheelStyleShow.angle
          })
        }, 900)
        return
      }
      clearInterval(timer)
      const awards = this.data.awards
      if (this.data.isLuckyDrawing && rewardIndex > 0 && awards.length > 0) {
        let angle = 360 - (360 / awards.length * (rewardIndex - 1) + 180 / awards.length)
        let originAngle = this.data.angle % 360
        angle = (360 - originAngle + angle) % 360
        this.setData({
          show: true,
          angle: angle + this.data.wheelStyleShow.angel + this.data.angle
        })
        setTimeout(() => {
          // this.data.isLuckyDrawing = false
          this.triggerEvent('afterTranstion')
        }, 4000)   // 4000, 此处时间应与动画时间保存一致
      }
    },
    awards (awards) {
      if (awards.length > 0) {
        if (this.data.wheelStyle.wheelSurfBg) {
          this.setData({
            canvasImg: this.data.wheelStyle.wheelSurfBg
          })
        } else {
          const query = wx.createSelectorQuery().in(this)
          query.select('.canvas')
            .fields({ node: true, size: true })
            .exec(this.init.bind(this))
        }
      }
    },
    wheelStyle (wheelStyle) {
      if (wheelStyle && Object.keys(wheelStyle).length > 0) {
        this.setData({ wheelStyleShow: { ..._default, ...wheelStyle } })
      }
    }
  },

  lifetimes: {
    attached () {
      wx.showLoading({ title: '加载中...' })
      mainIndex = 0
      this.data.isLuckyDrawing = false
      const rate = wx.getSystemInfoSync().screenWidth / 375 * this.data.canvasSize / 672
      this.setData({ rate })
    }
  },

  methods: {
    init (res) {
      const canvas = res[0].node
      const canvasWidth = res[0].width
      const canvasHeight = res[0].height
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = canvasWidth * dpr
      canvas.height = canvasHeight * dpr
      let ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      const radius = Math.min(canvasWidth, canvasHeight)
      let x = radius / 2
      let y = radius / 2
      ctx.translate(x, y)
      ctx.clearRect(-radius, -radius, radius, radius)
      const rate = this.data.rate
      const num = this.data.awards.length

      // 平分角度
      let angel = (2 * Math.PI / 360) * (360 / num)
      let startAngel = 2 * Math.PI / 360 * (-90)
      let endAngel = 2 * Math.PI / 360 * (-90) + angel

      // 画外圆
      ctx.beginPath()
      ctx.lineWidth = 10 * rate
      ctx.strokeStyle = this.data.wheelStyleShow.outerCircle.color
      ctx.arc(0, 0, 162 * rate, 0, 2 * Math.PI)
      ctx.stroke()

      // 画里圆
      ctx.beginPath()
      ctx.lineWidth = 10 * rate
      ctx.strokeStyle = this.data.wheelStyleShow.innerCircle.color
      ctx.arc(0, 0, 153 * rate, 0, 2 * Math.PI)
      ctx.stroke()

      // 装饰点
      // let dotColor = this.data.wheelStyleShow.dots
      // for (let i = 0; i < 12; i++) {
      //   // 装饰点 圆心 坐标计算
      //   ctx.beginPath()
      //   let radius = 151 * rate
      //   let xr = radius * Math.cos(startAngel)
      //   let yr = radius * Math.sin(startAngel)
      //   ctx.fillStyle = dotColor[Math.abs(i - dotColor.length + 1) % dotColor.length]
      //   ctx.arc(xr, yr, 8 * rate, 0, 2 * Math.PI)
      //   ctx.fill()
      //   startAngel += (2 * Math.PI / 360) * (360 / 12)
      // }

      // 画里转盘
      let colors = this.data.wheelStyleShow.disk
      // for (let i = 0; i < num; i++) {
      //   ctx.beginPath()
      //   ctx.lineWidth = 140 * rate
      //   ctx.strokeStyle = colors[i % colors.length]
      //   ctx.arc(0, 0, 66 * rate, startAngel, endAngel)
      //   ctx.stroke()
      //   startAngel = endAngel
      //   endAngel += angel
      // }
      for (let i = 0; i < num; i++) {
        ctx.beginPath()
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 149 * rate, startAngel, endAngel)
        ctx.closePath();
        ctx.fill();
        startAngel = endAngel
        endAngel += angel
      }

      startAngel = angel / 2
      this.drawImage(canvas, ctx, rate, startAngel, angel)
    },
    drawImage (canvas, ctx, rate, startAngel, angel) {
      const awards = this.data.awards
      awards.forEach((award, i) => {
        if (award.image) {
          let image = canvas.createImage()
          image.src = award.image
          image.onload = () => {
            let timeHandle = setInterval(() => {
              if (mainIndex === i) {
                clearInterval(timeHandle)
                mainIndex++
                const imgWidth = 50 * rate
                const imgHeight = 50 * rate
                ctx.save()
                ctx.rotate(startAngel)
                ctx.drawImage(image, -24 * rate, -98 * rate, imgWidth, imgHeight)
                ctx = this.drawTitle(ctx, rate, award.name)
                startAngel += angel
                if (mainIndex === awards.length) {
                  this.convertCanvasToImage(canvas)
                }
              }
            }, 50)
          }
        } else {
          let timeHandle = setInterval(() => {
            if (mainIndex === i) {
              clearInterval(timeHandle)
              mainIndex++
              ctx.save()
              ctx.rotate(startAngel)
              ctx = this.drawTitle(ctx, rate, award.name)
              startAngel += angel
              if (mainIndex === awards.length) {
                this.convertCanvasToImage(canvas)
              }
            }
          }, 50)
        }
      })
    },
    drawTitle (ctx, rate, title) {
      if (title) {
        const font = this.data.wheelStyleShow.title.font
        ctx.font = `${Math.round(font * rate)}px FZZhunYuan-M02S`
        ctx.fillStyle = this.data.wheelStyleShow.title.color
        ctx.textAlign = 'center'
        title.split(/\n/).forEach((item, index) => {
          ctx.fillText(item, 0, -(114 - index * (font)) * rate)
        })
        ctx.restore()
      }
      return ctx
    },
    convertCanvasToImage (canvas) {
      let that = this
      wx.canvasToTempFilePath({
        canvas: canvas,
        success (res) {
          console.log('success', res)
          that.setData({
            canvasImg: res.tempFilePath
          })
          uploadFile(res.tempFilePath, 'wheel_surf_bg.png')
        },
        fail (res) {
          console.log('error', res)
        }
      }, this)
    },
    play () {
      if (!this.data.isLuckyDrawing) {
        // this.data.isLuckyDrawing = true
        this.triggerEvent('play')
      }
    },
    imageLoaded () {
      wx.hideLoading()
      this.triggerEvent('imageLoad')
    }
  }
})
