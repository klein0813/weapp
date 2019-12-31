// components/imagePreview/imagePreview.js
let tempData = {}
let marginRight = 15
const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    pictures: Array,
    previewIndex: {
      type: Number,
      value: 0
    },
    isPreview: {
      type: Boolean,
      value: false
    }
  },

  data: {
    // StatusBar: app.globalData.StatusBar,
    // CustomBar: app.globalData.CustomBar,
    CustomBar: 81,
    // bgColor: 'black',
    // pageIndex: 100,
    // showModal: false,
    imagesInfo: [],
    propValue: {},
    hiddenBgImg: []
  },

  attached: function () {
    let systemInfo = wx.getSystemInfoSync()
    this.data.windowHeight = systemInfo.windowHeight
    this.data.windowWidth = systemInfo.windowWidth
    this.setData({
      propValue: {
        windowHeight: systemInfo.windowHeight,
        windowWidth: systemInfo.windowWidth
      }
    })
  },

  observers: {
    'previewIndex': function (previewIndex) {
      this.checkParams()
      this.setData({
        currentSwiper: previewIndex
      })
      this.setOffsetX(this.data.previewIndex)
    }
  },

  methods: {
    indexChange (event) {
      let index = event.index
      this.setData({
        propValue: this.data.imagesInfo[index],
        currentSwiper: index
      })
    },

    toSaveImage: function (e) {
      tempData['imageUrl'] = this.data.pictures[e.index]
      this.setData({ showModal: true })
    },

    saveImage: function () {
      let url = tempData['imageUrl']
      let that = this
      wx.getSetting({
        success (res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                that.saveToAlbum(url)
              }
            })
          } else {
            that.saveToAlbum(url)
          }
        }
      })
    },

    saveToAlbum: function (url) {
      wx.getImageInfo({
        src: url,
        success: (res) => {
          let path = res.path
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success: () => {
              wx.showToast({
                title: '保存成功'
              })
            }
          })
        }
      })
    },

    back: function () {
      this.setData({
        isPreview: false,
        hiddenBgImg: []
      })
    },

    click: function (e) {
      let url = this.data.pictures[e.index]
      this.setData({
        isPreview: false,
        hiddenBgImg: []
      })
      this.triggerEvent('click', url)
    },

    checkParams: function () {
      let previewIndex = this.data.previewIndex
      if (previewIndex < 0) {
        previewIndex = 0
        this.setData({
          previewIndex
        })
        console.warn('current isnot on urls,it will be the first value of urls!')
      }
    },

    setOffsetX (index) {
      let offsetX = -(marginRight + this.data.windowWidth) * index
      this.setData({
        boxTranslateX: `${offsetX}px`
      })
    },

    imageLoaded: function (e) {
      let imagesInfo = this.data.imagesInfo
      let index = e.currentTarget.dataset.current
      let fixHeight = e.detail.height * this.data.windowWidth / e.detail.width
      imagesInfo[index] = {
        height: fixHeight,
        width: this.data.windowWidth,
        index: index
      }
      this.setData({
        imagesInfo,
        [`hiddenBgImg[${index}]`]: true
      })
      if (index === this.data.previewIndex) {
        this.setData({
          propValue: imagesInfo[index]
        })
      }
    }
  }
})
