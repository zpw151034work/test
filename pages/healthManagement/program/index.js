//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '营养管理方案', //导航栏 中间的标题
    },
    active: 0,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    list: ""
  },
  //点击选项卡
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    var that = this;
    if (event.detail.title == '营养') {
      this.setData({
        active: 0,
        'navbarData.title': "营养管理方案"
      });
      that.selectComponent("#nutrition").pageData1()
    } else if (event.detail.title == '运动') {
      this.setData({
        active: 1,
        'navbarData.title': "运动管理方案"
      })
      that.selectComponent("#exercise").pageData2()
    } else if (event.detail.title == '睡眠') {
      this.setData({
        active: 2,
        'navbarData.title': "睡眠管理方案"
      })
    } else if (event.detail.title == '心理') {
      this.setData({
        active: 3,
        'navbarData.title': "心理管理方案"
      })
    } else if (event.detail.title == '中医') {
      this.setData({
        active: 4,
        'navbarData.title': "心理管理方案"
      })
    } else if (event.detail.title == '用药') {
      this.setData({
        active: 5,
        'navbarData.title': "用药管理方案"
      })
    }
  },
  onReady() {
    var that = this;
    that.selectComponent("#nutrition").pageData1()

  },

  onLoad: function (options) {
    
    var that = this;
    if (options.name == "营养") {
      that.setData({
        active: 0,
        'navbarData.title': "营养管理方案"
      })
      that.selectComponent("#nutrition").pageData1()
    } else if (options.name == "运动") {
      that.setData({
        active: 1,
        'navbarData.title': "运动管理方案"
      })
    } else if (options.name == "睡眠") {
      that.setData({
        active: 2,
        'navbarData.title': "睡眠管理方案"
      })
    } else if (options.name == "心理") {
      that.setData({
        active: 3,
        'navbarData.title': "心理管理方案"
      })
    } else if (options.name == "用药") {
      that.setData({
        active: 4,
        'navbarData.title': "用药管理方案"
      })
    }
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })
    this.setData({
      list: getApp().globalData.list
    });
  },

})