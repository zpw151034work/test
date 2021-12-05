// pages/healthComplaint/index.js
// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
let utils = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    fileList: [
    ],
    fileList3: [
    ],
    fileList4: [
    ],
    fileList5: [
    ],
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康主诉', //导航栏 中间的标题
    },
    lastArea:2000,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    this.setData({
      statusBarHeight: statusBarHeight,
    })
  },
  //上传上传血常规报告
  afterRead(event) {
    wx.showLoading({
      title: '请稍等。。。',
    })
    let that = this;
    const { file } = event.detail;
    wx.uploadFile({
      url: utils.API_URL + '/file/upload',
      filePath: file[0].url,
      name: 'file',
      header: {
        'Content-Type': 'application/json',
        'Token': `${wx.getStorageSync('Token')}`
      },
      formData: {
        'user': 'test'
      },
      success(res) {
        wx.hideLoading()
        let fileList = that.data.fileList
        fileList.push({ name: '图片', url: utils.Host + JSON.parse(res.data).data });
        that.setData({ fileList: fileList });
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  //上传文件
  afterRead3(event) {
    wx.showLoading({
      title: '请稍等。。。',
    })
    let that = this;
    const { file } = event.detail;
    wx.uploadFile({
      url: utils.API_URL + '/file/upload',
      filePath: file[0].url,
      name: 'file',
      header: {
        'Content-Type': 'application/json',
        'Token': `${wx.getStorageSync('Token')}`
      },
      formData: {
        'user': 'test'
      },
      success(res) {
        wx.hideLoading()
        let fileList = that.data.fileList3
        fileList.push({ name: '图片', url: utils.Host + JSON.parse(res.data).data });
        that.setData({ fileList3: fileList });
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  //上传文件
  afterRead4(event) {
    wx.showLoading({
      title: '请稍等。。。',
    })
    let that = this;
    const { file } = event.detail;
    wx.uploadFile({
      url: utils.API_URL + '/file/upload',
      filePath: file[0].url,
      name: 'file',
      header: {
        'Content-Type': 'application/json',
        'Token': `${wx.getStorageSync('Token')}`
      },
      formData: {
        'user': 'test'
      },
      success(res) {
        wx.hideLoading()
        let fileList = that.data.fileList4
        fileList.push({ name: '图片', url: utils.Host + JSON.parse(res.data).data });
        that.setData({ fileList4: fileList });
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  //上传文件
  afterRead5(event) {
    wx.showLoading({
      title: '请稍等。。。',
    })
    let that = this;
    const { file } = event.detail;
    wx.uploadFile({
      url: utils.API_URL + '/file/upload',
      filePath: file[0].url,
      name: 'file',
      header: {
        'Content-Type': 'application/json',
        'Token': `${wx.getStorageSync('Token')}`
      },
      formData: {
        'user': 'test'
      },
      success(res) {
        wx.hideLoading()
        let fileList = that.data.fileList5
        fileList.push({ name: '图片', url: utils.Host + JSON.parse(res.data).data });
        that.setData({ fileList5: fileList });
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

  sureFun: function () {
    let that = this
    let list = this.data.fileList
    let list3 = this.data.fileList3
    let list4 = this.data.fileList4
    let list5 = this.data.fileList5
    if (list.length == 0 && list3.length == 0 && list4.length == 0 && list5.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传照片',
        showCancel: false,
      })
      return
    }
    wx.showLoading({
      title: '请稍等。。。'
    })
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("监听用户下拉动作");
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
     console.log("分享用户")
 
   },

   // 获取输入框的值
  getDataBindTap: function(e) {
          var information = e.detail.value;//输入的内容
          var value = e.detail.value.length;//输入内容的长度
          var that = this;
          let lastArea = that.data.lastArea; 
          lastArea = 2000 - value;//剩余字数
          that.setData({
            information: information,
            lastArea: lastArea
          })
        },
  
})

