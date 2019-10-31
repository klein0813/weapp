// pages/dreamCreation/template/template.js
import regeneratorRuntime from '../../../utils/libs/regenerator.js'
import { netImgUrl2localImgUrl } from '../../../utils/util'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: app.screenWidth,
    windowHeight: app.contentHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.drawCanvas()
  },
  canvasDrawPromisify(canvasContext) {
    return (...param) => {
      return new Promise(resolve => {
        canvasContext.draw(...param, function () {
          resolve();
        })
      })
    }
  },
  drawCanvas: async function () {
    let that = this
    let dreamInfo = {
      photo: 'https://dev-statics.maiscrm.com/c39b6a4f089166077581b432.png',
      teamRank: 7,
      points: 678,
      personalRank: 5,
      name: '张小花',
      declaration: '别管人家怎么说,我就要有机会去月球看看',
      qrImage: 'https://dev-statics.maiscrm.com/7f14df7f03834c74d4dddd77.png'
    }
    let bottom = false
    let canvasId = 'canvas-id'

    let imageHeight = 1237

    // 矢量智能对象(右上角) 、颜色填充 2(左下角)、 照片、图层605(二维码)
    let imgNetUrls = [
      'https://dev-statics.maiscrm.com/f3a04c23d977a03e4ec4edba.png',
      'https://dev-statics.maiscrm.com/a7c67036bffc34cc8423d3ab.png',
      'https://dev-statics.maiscrm.com/c39b6a4f089166077581b432.png',
      'https://dev-statics.maiscrm.com/7f14df7f03834c74d4dddd77.png'
    ]
    let imgLocalUrls = await netImgUrl2localImgUrl(imgNetUrls)


    
    let ctx = wx.createCanvasContext(canvasId)
    // background color
    ctx.setFillStyle('#f46e56')
    ctx.fillRect(0, 0, 375, 672)
    // NIKE
    ctx.setFillStyle('#ff9871')
    ctx.fillRect(0, 465, 173, 127)
    // layer 105
    ctx.setFillStyle('#fffff8')
    ctx.fillRect(0, 9, 164, 477)
    // 管什么分寸
    ctx.setFillStyle('#f46e56')
    ctx.font = 'W3 9px HiraginoSansGB-W3'
    ctx.setTextAlign('left')
    ctx.fillText('管   什   么   分   寸', 40, 32)
    ctx.fillText('管   什   么   分   寸', 40, 45)
    for (let i = 1; i <= 9; i ++) {
      ctx.fillText('J U S T    D O    I T', 40, 45 + i * 12)
    }
    // 图层107
    ctx.setFillStyle('#ff6c52')
    ctx.fillRect(157, 480, 219, 193)

    // layer 108
    ctx.setFillStyle('#fc4a2a')
    ctx.fillRect(0, 0, 164, 16)
    //  JUST DO IT
    ctx.setFillStyle('#29283a')
    ctx.font = 'W3 11px HiraginoSansGB-W3'
    ctx.setTextAlign('left')
    ctx.fillText('JUST   DO   IT.   JUST   DO   IT.', 6, 12)
    // nike logo
    ctx.drawImage(imgLocalUrls[0], 261, 0, 115, 48)
    let teamRank = 7
    let point = 678
    let personalRank = 5
    let name = '张小花'
    let photo = imgLocalUrls[2]
    let declaration = '别管人家怎么说,我就要有机会去月球看看'
    let qr = imgLocalUrls[3]

    // 队伍排名
    ctx.setFillStyle('#282739')
    ctx.font = 'W6 10px HiraginoSansGB-W6'
    ctx.setTextAlign('left')
    ctx.fillText('队伍排名', 26, 238)
    ctx.setFillStyle('#f46e56')
    ctx.font = '500 41px DiaNikeWomen-Display'
    ctx.setTextAlign('left')
    ctx.fillText(teamRank, 34, 275)
    // 总积分
    ctx.setFillStyle('#282739')
    ctx.font = 'W6 10px HiraginoSansGB-W6'
    ctx.setTextAlign('left')
    ctx.fillText('总积分', 33, 329)
    ctx.setFillStyle('#f46e56')
    ctx.font = 'Display 41px DiaNikeWomen-Display'
    ctx.setTextAlign('left')
    ctx.fillText(point, 15, 366)
    // 个人排行
    ctx.setFillStyle('#282739')
    ctx.font = 'W6 10px HiraginoSansGB-W6'
    ctx.setTextAlign('left')
    ctx.fillText('个人排行', 27, 422)
    ctx.setFillStyle('#f46e56')
    ctx.font = '800 41px DiaNikeWomen-Display'
    ctx.setTextAlign('left')
    ctx.fillText(personalRank, 36, 459)
    // name
    let firstName = name[0]
    let lastName = name.substring(1)
    ctx.setFillStyle('#fffff8')
    ctx.font = 'W3 13px HiraginoSansGB-W3'
    ctx.setTextAlign('left')
    ctx.fillText(firstName, 47, 535)
    ctx.font = 'W6 13px HiraginoSansGB - W6'
    ctx.setTextAlign('left')
    ctx.fillText(lastName, 67, 535)
    // 宣言
    ctx.setFillStyle('#fffff8')
    ctx.font = 'W3 13px HiraginoSansGB-W3'
    ctx.setTextAlign('left')
    for(let i = 0; i < declaration.length; i++) {
      if (i <= 13) {
        ctx.fillText(declaration[i], 168 + 13 * i, 530)
      } else {
        ctx.fillText(declaration[i], 168 + 13 * (i - 14), 548)
      }
    }
    // user image
    ctx.drawImage(photo, 94, 112, 281, 373)
    let red = 28
    let green = 2
    let blue = -41
    let canvasDraw = this.canvasDrawPromisify(ctx);
    await canvasDraw(true);
    wx.canvasGetImageData({
      canvasId: canvasId,
      x: 94,
      y: 112,
      width: 281,
      height: 373,
      success(res) {
        let srcPixels = res.data
        let dstPixels = res.data
        let v
        for (let i = 0; i < srcPixels.length; i += 4) {
          dstPixels[i] = (v = srcPixels[i] + red) > 255 ? 255 : v < 0 ? 0 : v
          dstPixels[i + 1] = (v = srcPixels[i + 1] + green) > 255 ? 255 : v < 0 ? 0 : v
          dstPixels[i + 2] = (v = srcPixels[i + 2] + blue) > 255 ? 255 : v < 0 ? 0 : v
          dstPixels[i + 3] = srcPixels[i + 3]
        }
        wx.canvasPutImageData({
          canvasId: canvasId,
          x: 94,
          y: 112,
          width: 281,
          height: 373,
          data: dstPixels
        })
      }
    })
    // ctx.draw(true, function () {
    // })
    // bottom
    if (true) {
      // 颜色填充 2
      ctx.drawImage(imgLocalUrls[1], 0, 575, 279, 97)
      // 二维码
      ctx.setFillStyle('#fffff8')
      ctx.fillRect(297, 588, 62, 62)
      ctx.drawImage(qr, 297, 588, 62, 62)
      imageHeight = 1334
    }
    await canvasDraw(true);
    console.log(imageHeight)
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 375,
      height: 1334,
      destWidth: 375,
      destHeight: imageHeight,
      canvasId: canvasId,
      complete(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})