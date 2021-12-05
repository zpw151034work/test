//获取应用实例
const app = getApp()
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '信息授权说明', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "" ,  
    show: true,
  },
  onLoad: function () {
			this.setData({
				statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'] +44
				})
      },
})
