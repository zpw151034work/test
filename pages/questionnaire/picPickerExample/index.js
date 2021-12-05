// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
let utils = require("../../../utils/util.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '营养饮食', //导航栏 中间的标题
    },
    topImageUrl: utils.IMG_URL + "/questionnaire/topPic.png",
    exampleImageUrl: utils.IMG_URL + "/questionnaire/example.png"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    this.setData({
      statusBarHeight: statusBarHeight,
      imageUrl: utils.IMG_URL + "/questionnaire/example.png"
    })
  },
  /**
   * 返回按钮
   */
  backFun: function () {
    wx.showModal({
      title: '提示',
      content: '如有任何疑问，请致电(010) 5272 9739',
      showCancel: false
    })
  },

  /**
   * 确认按钮
   */
  sureFun: function (options) {
    wx.navigateBack({
      delta: 1,
    })
  },

})