//获取应用实例
const app = getApp()
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康预警', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    listData:[]
  },
  onLoad: function (options) { 
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']+44 
    })
    let temp = JSON.parse(options.data)
    this.setData({
      listData:temp
    })
  },
})