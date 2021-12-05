//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康预警', //导航栏 中间的标题
    },
    date: '',
    checked: true,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    loading: false,
    color: '#000',
    background: '#f8f8f8',
    animated: false,
    imageURL: "https://img01.yzcdn.cn/vant/ipad.jpeg",
    
  },
  onLoad: function () { 
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })
    let _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
})